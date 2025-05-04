const API_URL = 'https://script.google.com/macros/s/AKfycbze1mXEuEHPoQ7_0uBATMPbPj-HSt4DxSknS9OifZW5umhoTvc1O5MUf0rdyL4zMi7E/exec';

fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    const scheduleDiv = document.getElementById("schedule");

    const today = new Date().toISOString().split("T")[0].replace(/-/g, "/"); // 例：2025/05/04
    const filtered = data.filter(d => d["日付"] === today);

    const rooms = [...new Set(filtered.map(d => d["教室名"]))];
    const times = [...new Set(filtered.map(d => d["時間帯"]))].sort();

    rooms.forEach(room => {
      const roomDiv = document.createElement("div");
      roomDiv.className = "room-block";
      roomDiv.innerHTML = `<h2>${room}</h2>`;
      times.forEach(time => {
        const entry = filtered.find(d => d["教室名"] === room && d["時間帯"] === time);
        const status = entry ? `🟥 予約：${entry["予約者名"]}（${entry["内容"]}）` : "🟩 空き";
        const p = document.createElement("p");
        p.textContent = `${time} - ${status}`;
        roomDiv.appendChild(p);
      });
      scheduleDiv.appendChild(roomDiv);
    });
  })
  .catch(err => {
    document.getElementById("schedule").textContent = "データの取得に失敗しました。";
    console.error(err);
  });
