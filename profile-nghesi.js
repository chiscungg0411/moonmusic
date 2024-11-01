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

/*---------------------------------------------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", function() {
    const nutPhat = document.querySelectorAll(".play-button");
    const thanhNhac = document.querySelector(".trinh-phat");
    const nutPhatTamDung = document.getElementById("phat-tam-dung");
    const nutTatTieng = document.getElementById("nut-tat-tieng");
    const iconVolume = document.getElementById("icon-volume");
    const thanhAmLuong = document.getElementById("thanh-am-luong");
    const audioPlayer = new Audio();
    let dangPhat = false;
    let dangTatTieng = false; // Trạng thái tắt tiếng
    let volumeCu = 1; // Lưu âm lượng ban đầu

    // Ẩn thông tin bài hát ban đầu
    document.querySelector(".ten-bai-hat").textContent = ""; // Xóa tên bài hát
    document.querySelector(".ten-nghe-si").textContent = ""; // Xóa tên nghệ sĩ
    document.getElementById("tong-thoi-gian").textContent = "0:00"; // Đặt tổng thời gian bài hát là 0:00

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
            nutPhatTamDung.querySelector("i").classList.replace("fa-pause", "fa-play");
            audioPlayer.pause(); // Dừng phát nhạc
            dangPhat = false;
        } else {
            nutPhatTamDung.querySelector("i").classList.replace("fa-play", "fa-pause");
            audioPlayer.play(); // Phát nhạc
            dangPhat = true;
        }
    });

    // Chức năng tắt tiếng
    nutTatTieng.addEventListener("click", function() {
        if (dangTatTieng) {
            // Bật tiếng
            audioPlayer.volume = volumeCu; // Khôi phục âm lượng
            iconVolume.classList.replace("fa-volume-xmark", "fa-volume-high"); // Đổi biểu tượng
        } else {
            // Tắt tiếng
            volumeCu = audioPlayer.volume; // Lưu âm lượng hiện tại
            audioPlayer.volume = 0; // Đặt âm lượng thành 0
            iconVolume.classList.replace("fa-volume-high", "fa-volume-xmark"); // Đổi biểu tượng
        }
        dangTatTieng = !dangTatTieng; // Đảo trạng thái tắt tiếng
    });

    function phatBaiHat(tenBaiHat, tenNgheSi, duongDan) {
        document.querySelector(".ten-bai-hat").textContent = tenBaiHat; // Hiển thị tên bài hát
        document.querySelector(".ten-nghe-si").textContent = tenNgheSi; // Hiển thị tên nghệ sĩ
        document.querySelector(".bia-album").src = "https://cdn.glitch.global/f9a3cc04-0b49-46cb-84b6-5390f34696dc/95bf2fee-ba53-4498-8636-0762dd66b978.image.png?v=1730173870408"; // Cập nhật ảnh bìa album
        document.getElementById("tong-thoi-gian").textContent = "3:42"; // Hiển thị tổng thời gian bài hát
        audioPlayer.src = duongDan; // Đặt link nhạc
        audioPlayer.play(); // Phát nhạc ngay khi chọn
        dangPhat = true;
        nutPhatTamDung.querySelector("i").classList.replace("fa-play", "fa-pause"); // Đổi biểu tượng sang 'pause'

        // Cập nhật thời gian bài hát
        audioPlayer.addEventListener("timeupdate", function() {
            const thoiGianHienTai = document.getElementById("thoi-gian-hien-tai");
            thoiGianHienTai.textContent = formatTime(audioPlayer.currentTime);
            thanhAmLuong.value = audioPlayer.volume * 100; // Cập nhật thanh âm lượng
        });

        // Cập nhật tổng thời gian
        audioPlayer.addEventListener("loadedmetadata", function() {
            document.getElementById("tong-thoi-gian").textContent = formatTime(audioPlayer.duration);
        });
    }

    // Định dạng thời gian
    function formatTime(seconds) {
        const phut = Math.floor(seconds / 60);
        const giay = Math.floor(seconds % 60);
        return `${phut}:${giay < 10 ? '0' : ''}${giay}`;
    }

    // Cập nhật âm lượng từ thanh âm lượng
    thanhAmLuong.addEventListener("input", function() {
        if (!dangTatTieng) {
            audioPlayer.volume = thanhAmLuong.value / 100; // Đặt âm lượng
        }
    });
});

