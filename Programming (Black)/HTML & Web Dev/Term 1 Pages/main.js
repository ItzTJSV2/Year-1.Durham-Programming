async function EmailClick() {
    var Email = "max.m.tran@durham.ac.uk";
    navigator.clipboard.writeText(Email);
    var textBox = document.getElementById('EmailText');
    textBox.value = "Copied!"
    await new Promise(r => setTimeout(r, 2000));
    textBox.value = "Email"
}