export function exportTextToFile(fileName: string, textData: string): void {
  const blobData = new Blob([textData], { type: 'text/plain' })
  const urlToBlob = window.URL.createObjectURL(blobData)
  const a = document.createElement('a')
  a.style.setProperty('display', 'none')
  document.body.appendChild(a)
  a.href = urlToBlob
  a.download = fileName
  a.click()
  window.URL.revokeObjectURL(urlToBlob)
  a.remove()
}

export function importFilesToText(
  func: (index: number, fileName: string, fileContent: string) => void,
) {
  const readFile = function (e: Event) {
    const files = (e.target as HTMLInputElement).files
    if (!files) return
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file) continue
      const reader = new FileReader()
      reader.onload = function (e) {
        const contents = e.target!.result
        func(i, file.name, contents as string)
        if (i >= files.length - 1) document.body.removeChild(fileInput)
      }
      reader.readAsText(file)
    }
  }
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.style.display = 'none'
  fileInput.onchange = readFile
  document.body.appendChild(fileInput)
  fileInput.click()
}
