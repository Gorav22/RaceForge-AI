import os
import torch
import shutil
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
        mesh = decode_latent_mesh(xm, latent).tri_mesh()
        output_path = f"outputs/text_{prompt.replace(' ', '_')}_{i}.obj"
        with open(output_path, 'w') as f:
            mesh.write_obj(f)
        print(f"[SUCCESS] 3D model saved at {output_path}")
