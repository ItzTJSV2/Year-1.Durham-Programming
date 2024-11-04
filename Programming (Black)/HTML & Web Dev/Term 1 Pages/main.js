async function EmailClick() {
    var Email = "max.m.tran@durham.ac.uk";
    navigator.clipboard.writeText(Email);
    document.getElementById('EmailText').innerHTML = "Copied!"
    await new Promise(r => setTimeout(r, 2000));
    document.getElementById('EmailText').innerHTML = "Email"
}