import React, { useState } from "react"
import supabase from "../../../../utils/general/supabaseclient"

type AddArtProps = {
    onUpload?: () => void
}

export default function AddArt({ onUpload }: AddArtProps) {
    const [file, setFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined)
    const [type, setType] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] ?? null
        setFile(selected)
        if (selected) {
            setPreviewUrl(URL.createObjectURL(selected))
        } else {
            setPreviewUrl(undefined)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) return setError("Please select a file")

        setLoading(true)
        setError("")

        try {
            const fileName = `${Date.now()}_${file.name}`
            const { error: storageError } = await supabase.storage
                .from("art")
                .upload(fileName, file)

            if (storageError) throw storageError
            const { data: publicUrlData } = supabase.storage
                .from("art")
                .getPublicUrl(fileName)

            const imageUrl = publicUrlData.publicUrl
            const { error: tableError } = await supabase
                .from("artwork")
                .insert([
                    {
                        image: imageUrl,
                        type,
                    },
                ])

            if (tableError) throw tableError

            setFile(null)
            setPreviewUrl(undefined)
            setType("")

            if (onUpload) onUpload()
        } catch (err) {
            if (err instanceof Error) {
                console.error("Error uploading art:", err.message)
                setError(err.message)
            } else {
                console.error("Unexpected error:", err)
                setError("An unexpected error occurred")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full p-6 bg-gray-900/90 text-white rounded-2xl shadow-lg gap-4 backdrop-blur-md"
        >
            <h2 className="text-2xl font-bold mb-2">Add New Artwork</h2>
            <div className="flex items-center space-x-4">
                <input
                    id="file-upload"
                    type="file"
                    accept="image/*,image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                />
                <label
                    htmlFor="file-upload"
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-700 transition"
                >
                    Choose File
                </label>
            </div>
            <div className="flex justify-center">
                <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-auto max-h-[25rem] md:max-h-[28rem] h-auto object-cover rounded-xl shadow-md border border-gray-700 mt-2"
                />
            </div>
            <input
                type="text"
                placeholder="Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="p-2 border border-gray-700 rounded bg-gray-800 text-white"
            />
            {error && <p className="text-red-500">{error}</p>}
            <button
                type="submit"
                disabled={loading}
                className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700 disabled:opacity-50"
            >
                {loading ? "Uploading..." : "Upload"}
            </button>
        </form>
    )
}
