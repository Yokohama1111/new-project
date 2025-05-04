const API_URL = 'https://script.google.com/macros/s/AKfycbze1mXEuEHPoQ7_0uBATMPbPj-HSt4DxSknS9OifZW5umhoTvc1O5MUf0rdyL4zMi7E/exec';

fetch(API_URL)
  .then(res => {
    console.log('レスポンス:', res);  // レスポンスオブジェクトを確認
    return res.json();
  })
  .then(data => {
    console.log('取得したデータ:', data);  // 取得したデータを確認

    const scheduleDiv = document.getElementById("schedule");

    const today = new Date().toISOString().split("T")[0].replace(/-/g, "/"); // 例：2025/05/04
    console.log('今日の日付:', today);  // 今日の日付を確認

    const filtered = data.filter(d => d["日付"] === today);
    console.log('今日の日付にフィルタリングされたデータ:', filtered);  // 今日の日付に一致するデータを確認

    const rooms = [...new Set(filtered.map(d => d["教室名"]))];
    console.log('フィルタリングされた教室名:', rooms);  // ユニークな教室名を確認

    const times = [...new Set(filtered.map(d => d["時間帯"]))].sort();
    console.log('フィルタリングされた時間帯:', times);  // ユニークな時間帯を確認

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
    console.error('エラー:', err);  // エラーの詳細を確認
  });
