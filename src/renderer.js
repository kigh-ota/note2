const noteList = document.getElementById('note-list');

for (let i = 1; i <= 100; i++) {
    const item = document.createElement('ul');
    item.innerText = `Note ${i}`;
    noteList.appendChild(item);
}
