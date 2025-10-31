import os
import torch
import shutil
import numpy as np
import trimesh
from shap_e.diffusion.sample import sample_latents
from shap_e.diffusion.gaussian_diffusion import diffusion_from_config
from shap_e.models.download import load_model, load_config
from shap_e.util.notebooks import decode_latent_mesh

def safe_load_model(model_name, device):
    """Safely load Shap-E model with auto-retry if checksum fails."""
    try:
        return load_model(model_name, device=device)
    except RuntimeError as e:
        if "checksum does not" in str(e).lower():
            print(f"[WARNING] Corrupted model cache detected for '{model_name}'. Re-downloading...")
            cache_dir = os.getenv("SHAP_E_CACHE_DIR") or os.path.join(os.getcwd(), "shap_e_model_cache")
            if os.path.exists(cache_dir):
                shutil.rmtree(cache_dir, ignore_errors=True)
                print(f"[INFO] Cleared cache folder: {cache_dir}")
            return load_model(model_name, device=device)
        else:
            raise

def generate_3d_from_text(prompt, batch_size=1):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    os.environ["SHAP_E_CACHE_DIR"] = os.path.join(os.getcwd(), "shap_e_model_cache")

    # Safe model loading
    model = safe_load_model('text300M', device)
    xm = safe_load_model('transmitter', device)

    diffusion = diffusion_from_config(load_config('diffusion'))
    latents = sample_latents(
        batch_size=batch_size,
        model=model,
        diffusion=diffusion,
        guidance_scale=15.0,
        model_kwargs=dict(texts=[prompt] * batch_size),
        progress=True,
        clip_denoised=True,
        use_fp16=torch.cuda.is_available(),
        use_karras=True,
        karras_steps=64,
        sigma_min=1e-3,
        sigma_max=160,
        s_churn=0,
    )

    os.makedirs("outputs", exist_ok=True)

    for i, latent in enumerate(latents):
        decoded_mesh = decode_latent_mesh(xm, latent)
        mesh = decoded_mesh.tri_mesh()
        
        vertex_channels = decoded_mesh.vertex_channels

        base_name = f"text_f1car_{i}"

        verts = mesh.verts.cpu().numpy() if torch.is_tensor(mesh.verts) else mesh.verts
        faces = mesh.faces.cpu().numpy() if torch.is_tensor(mesh.faces) else mesh.faces
        
        if vertex_channels is not None and 'R' in vertex_channels:
            r = vertex_channels['R'].cpu().numpy()
            g = vertex_channels['G'].cpu().numpy()
            b = vertex_channels['B'].cpu().numpy()
            
            vertex_colors = np.stack([r, g, b], axis=1)
            vertex_colors = (np.clip(vertex_colors, 0, 1) * 255).astype(np.uint8)
            
            print(f"[INFO] Extracted vertex colors: {vertex_colors.shape}")
        else:
            vertex_colors = np.ones((len(verts), 3), dtype=np.uint8) * 128
            print(f"[WARNING] No vertex colors found, using default gray")
        
        colored_mesh = trimesh.Trimesh(
            vertices=verts,
            faces=faces,
            vertex_colors=vertex_colors,
            process=False
        )

        glb_path = f"outputs/{base_name}.glb"
        colored_mesh.export(glb_path, file_type='glb')
        print(f"[✅] GLB (colored) saved at {glb_path}")

        obj_path = f"outputs/{base_name}.obj"
        with open(obj_path, 'w') as f:
            mesh.write_obj(f)
        print(f"[ℹ️] OBJ (geometry only) saved at {obj_path}")

    print(f"\n🎨 All models saved in: {os.path.abspath('outputs')}")
    print(f"[INFO] Total vertices: {len(verts)}, Total faces: {len(faces)}")

if __name__ == "__main__":
    generate_3d_from_text("a futuristic racing car", batch_size=1)