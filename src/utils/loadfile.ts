export default function loadFile<T = any>(
  fileInputId: string,
  onLoad: (data: T) => void
) {
  if (typeof window.FileReader !== 'function') {
    alert("The file API isn't supported on this browser yet.");
    return;
  }

  const input: HTMLInputElement | null = document.getElementById(
    fileInputId
  ) as HTMLInputElement;

  if (!input) {
    alert("Um, couldn't find the fileinput element.");
  } else if (!input.files) {
    alert(
      "This browser doesn't seem to support the `files` property of file inputs."
    );
  } else if (!input.files[0]) {
    alert("Please select a file before clicking 'Load'");
  } else {
    const file = input.files[0];
    const fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsText(file);
  }

  function receivedText(e: any) {
    const lines = e.target.result;
    const data = JSON.parse(lines);
    onLoad(data);
  }
}
