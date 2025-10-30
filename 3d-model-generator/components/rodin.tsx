"use client"

import { useState, useEffect } from "react"
import { ExternalLink, Download, ArrowLeft, Zap } from "lucide-react" // Added Zap icon
import type { FormValues } from "@/lib/form-schema"
import { submitRodinJob, checkJobStatus, downloadModel } from "@/lib/api-service"
import ModelViewer from "./model-viewer"
import Form from "./form"
import StatusIndicator from "./status-indicator"
import OptionsDialog from "./options-dialog"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function Rodin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [isPolling, setIsPolling] = useState(false)
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [jobStatuses, setJobStatuses] = useState<Array<{ uuid: string; status: string }>>([])
  const [showOptions, setShowOptions] = useState(false)
  const [showPromptContainer, setShowPromptContainer] = useState(true)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [options, setOptions] = useState({
    condition_mode: "concat" as const,
    quality: "medium" as const,
    geometry_file_format: "glb" as const,
    use_hyper: false,
    tier: "Regular" as const,
    TAPose: false,
    material: "PBR" as const,
  })

  // ... (useEffect, handleOptionsChange, handleStatusCheck, handleSubmit functions remain the same)
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = "hidden"
      document.documentElement.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = ""
        document.documentElement.style.overflow = ""
      }
    }
  }, [isMobile])
  const handleOptionsChange = (newOptions: any) => setOptions(newOptions)
  async function handleStatusCheck(subscriptionKey: string, taskUuid: string) { /* ... no changes here ... */ }
  async function handleSubmit(values: FormValues) { /* ... no changes here ... */ }

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank")
    }
  }

  const handleBack = () => {
    setShowPromptContainer(true)
  }

  const ExternalLinks = () => (
    <div className="flex items-center space-x-6">
      {/* Links can go here */}
    </div>
  )

  return (
    <div className="relative h-[100dvh] w-full">
      {/* NEW: Navigation bar styled like F1 Design */}
      <header className="absolute top-0 left-0 right-0 z-20 p-4 bg-black flex items-center justify-between pointer-events-auto">
        {/* Left section: Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <Zap className="h-6 w-6 text-white" /> {/* Lightning bolt icon */}
          </div>
          <span className="text-2xl font-bold text-white uppercase tracking-wider">F1 DESIGN</span>
        </div>

        {/* Right section: Home Link */}
        <nav>
          <a href="http://localhost:8080" className="text-gray-300 hover:text-white text-lg font-medium">
            Home
          </a>
        </nav>
      </header>

      {/* Full-screen canvas */}
      <div className="absolute inset-0 z-0">
        <ModelViewer modelUrl={isLoading ? null : modelUrl} />
      </div>

      {/* Overlay UI */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Logo in top left - Pushed down to avoid navbar */}
        <div className="absolute top-24 left-6 pointer-events-auto"> {/* Adjusted top further for navbar */}
          <h1 className="text-5xl text-white font-black tracking-tighter">
            3D-<span className="text-red-500">Generator</span>
          </h1>
          <p className="text-gray-300 mt-1">Create 3D models from text or images.</p>
        </div>

        {/* Links in top right - Pushed down to avoid navbar */}
        {!isMobile && (
          <div className="absolute top-24 right-6 pointer-events-auto"> {/* Adjusted top further for navbar */}
            <ExternalLinks />
          </div>
        )}

        {/* ... (Rest of the JSX remains the same) ... */}
        <StatusIndicator isLoading={isLoading} jobStatuses={jobStatuses} />

        {error && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-gray-900/80 text-white px-4 py-2 rounded-md tracking-normal">
            {error}
          </div>
        )}

        {!isLoading && modelUrl && !showPromptContainer && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 pointer-events-auto">
            <Button onClick={handleBack} className="bg-black hover:bg-gray-900 text-white border border-white/20 rounded-full px-4 py-2 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="tracking-normal">Back</span>
            </Button>
            <Button onClick={handleDownload} className="bg-white hover:bg-gray-200 text-black rounded-full px-4 py-2 flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span className="tracking-normal">Download</span>
            </Button>
          </div>
        )}

        {showPromptContainer && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-3xl px-4 sm:px-0 pointer-events-auto">
            <Form isLoading={isLoading} onSubmit={handleSubmit} onOpenOptions={() => setShowOptions(true)} />
            {isMobile && (
              <div className="mt-4 flex justify-center pointer-events-auto">
                <ExternalLinks />
              </div>
            )}
          </div>
        )}
      </div>

      <OptionsDialog open={showOptions} onOpenChange={setShowOptions} options={options} onOptionsChange={handleOptionsChange} />
    </div>
  )
}