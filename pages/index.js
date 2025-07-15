import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  const [image, setImage] = useState(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(URL.createObjectURL(file))
      runOCR(file)
    }
  }

  const runOCR = async (file) => {
    setLoading(true)
    const Tesseract = await import('tesseract.js')
    const reader = new FileReader()
    reader.onload = async () => {
      const result = await Tesseract.recognize(reader.result, 'eng', {
        logger: (m) => console.log(m)
      })
      setText(result.data.text)
      setLoading(false)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <Head>
        <title>PokéCatalog</title>
      </Head>
      <main style={{ padding: 20 }}>
        <h1>📸 PokéCatalog - Reconheça sua carta Pokémon</h1>
        <input type="file" accept="image/*" onChange={handleChange} />
        {image && <img src={image} alt="Carta" style={{ maxWidth: '100%', marginTop: 20 }} />}
        {loading && <p>🔍 Processando imagem...</p>}
        {text && (
          <div style={{ marginTop: 20 }}>
            <h2>📝 Texto Reconhecido:</h2>
            <pre>{text}</pre>
          </div>
        )}
      </main>
    </div>
  )
}
