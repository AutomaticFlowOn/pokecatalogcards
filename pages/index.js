import Head from 'next/head'
import { useState } from 'react'
import Tesseract from 'tesseract.js'

export default function Home() {
  const [image, setImage] = useState(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(URL.createObjectURL(file))
      setLoading(true)
      setError(null)
      setText('')
      try {
        const { data: { text } } = await Tesseract.recognize(file, 'eng', {
          logger: m => console.log(m)
        })
        setText(text)
      } catch (err) {
        setError('Erro ao processar imagem. Tente outra ou use um dispositivo diferente.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div>
      <Head>
        <title>PokéCatalog OCR</title>
      </Head>
      <main style={{ padding: 20 }}>
        <h1>📸 PokéCatalog OCR</h1>
        <input type="file" accept="image/*" onChange={handleChange} />
        {image && <img src={image} alt="Carta" style={{ maxWidth: '100%', marginTop: 20 }} />}
        {loading && <p>⏳ Processando imagem...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
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
