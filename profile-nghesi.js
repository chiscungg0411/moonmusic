document.addEventListener('DOMContentLoaded', function () {
    const xemThemButton = document.querySelector('.xem-them');
    const anBotButton = document.querySelector('.an-bot');
    
    xemThemButton.addEventListener('click', function() {
        // Hiển thị các phần tử có class 'hidden'
        document.querySelectorAll('.song.hidden').forEach(function(song) {
            song.classList.remove('hidden');
        });
        
        // Ẩn nút "Xem thêm" sau khi hiển thị thêm các bài hát
        this.style.display = 'none'; 
        // Hiện nút "Ẩn Bớt"
        anBotButton.style.display = 'block';
    });

    anBotButton.addEventListener('click', function() {
        // Ẩn các bài hát đã hiển thị
        document.querySelectorAll('.song').forEach(function(song, index) {
            if (index >= 5) { // Giả sử bạn chỉ muốn giữ 5 bài đầu tiên hiển thị
                song.classList.add('hidden');
            }
        });

        // Hiện nút "Xem thêm" sau khi ẩn bớt các bài hát
        xemThemButton.style.display = 'block';
        // Ẩn nút "Ẩn Bớt"
        this.style.display = 'none';
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const nutPhat = document.querySelectorAll(".play-button");
    const thanhNhac = document.getElementById("thanh-nhac");
    const nutPhatTamDung = document.getElementById("phat-tam-dung");
    const bieuTuongPhatTamDung = nutPhatTamDung.querySelector("i");
    const audioPlayer = new Audio(); // Tạo đối tượng âm thanh
    let dangPhat = false;

    // Khi nhấn nút "Phát"
    nutPhat.forEach(button => {
        button.addEventListener("click", function() {
            thanhNhac.style.display = "flex"; // Hiển thị thanh nhạc
            phatBaiHat(
                "Sắp Nổi Tiếng",
                "HIEUTHUHAI",
                "https://cdn.glitch.global/f9a3cc04-0b49-46cb-84b6-5390f34696dc/HIEUTHUHAI%20-%20S%E1%BA%AFp%20N%E1%BB%95i%20Ti%E1%BA%BFng%20(prod.%20by%20Kewtiie)%20%5BOfficial%20Lyric%20Video%5D.mp3?v=1730224508456"
            );
        });
    });

    // Chức năng phát/tạm dừng nhạc
    nutPhatTamDung.addEventListener("click", function() {
        if (dangPhat) {
            bieuTuongPhatTamDung.classList.replace("fa-pause", "fa-play");
            audioPlayer.pause(); // Dừng phát nhạc
            dangPhat = false;
        } else {
            bieuTuongPhatTamDung.classList.replace("fa-play", "fa-pause");
            audioPlayer.play(); // Phát nhạc
            dangPhat = true;
        }
    });

    function phatBaiHat(tenBaiHat, tenNgheSi, duongDan) {
        document.querySelector(".ten-bai-hat").textContent = tenBaiHat;
        document.querySelector(".ten-nghe-si").textContent = tenNgheSi;
        audioPlayer.src = duongDan; // Đặt link nhạc
        audioPlayer.play();         // Phát nhạc ngay khi chọn
        dangPhat = true;
        bieuTuongPhatTamDung.classList.replace("fa-play", "fa-pause");
    }
});

