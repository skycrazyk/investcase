export default function download(
  content: any,
  fileName: string,
  contentType: string
) {
  var a = document.createElement('a');
  var file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

// download(jsonData, 'json.txt', 'text/plain');
