document.addEventListener('DOMContentLoaded', function () {
    const xemThemButton = document.querySelector('.xem-them');
    const anBotButton = document.querySelector('.an-bot');
    const nutPhatTamDung = document.getElementById("phat-tam-dung");
    const nutTatTieng = document.getElementById("nut-tat-tieng");
    const thanhAmLuong = document.getElementById("thanh-am-luong");
    const thanhThoiGian = document.getElementById("thanh-thoi-gian");
    const dieuKhien = document.querySelector(".dieu-khien");
    const audioPlayer = new Audio();
    const danhSachBaiHat = Array.from(document.querySelectorAll('.popular-songs .song, .popular-songs .song.hidden'));
    let chiSoBaiHatHienTai = null; // Không có bài hát nào được chọn ban đầu
    let dangPhat = false;

    capNhatTrangThaiDieuKhien(false);

    danhSachBaiHat.forEach((baiHat, index) => {
        baiHat.addEventListener('click', () => {
            chiSoBaiHatHienTai = index;
            phatBaiHat(baiHat, true);
            capNhatTrangThaiDieuKhien(true);
        });
    });

    nutPhatTamDung.addEventListener("click", togglePlayPause);

    thanhThoiGian.addEventListener("input", () => {
        if (dangPhat) audioPlayer.currentTime = thanhThoiGian.value;
    });

    thanhAmLuong.addEventListener("input", () => {
        if (dangPhat) audioPlayer.volume = thanhAmLuong.value / 100;
    });

    function phatBaiHat(baiHat, tuDongPhat = false) {
        const title = baiHat.getAttribute('data-title');
        const artist = baiHat.getAttribute('data-artist');
        const url = baiHat.getAttribute('data-url');
        document.querySelector(".ten-bai-hat").textContent = title;
        document.querySelector(".ten-nghe-si").textContent = artist;
        audioPlayer.src = url;

        if (tuDongPhat) {
            audioPlayer.play();
            dangPhat = true;
        } else {
            dangPhat = false;
        }
    }

    function togglePlayPause() {
        if (dangPhat) {
            audioPlayer.pause();
            dangPhat = false;
            resetThoiGian(); // Reset thời gian về 0 khi tạm dừng
        } else if (chiSoBaiHatHienTai !== null) {
            audioPlayer.play();
            dangPhat = true;
        }
        capNhatTrangThaiDieuKhien(dangPhat);
    }

    function resetThoiGian() {
        audioPlayer.currentTime = 0; // Kéo thời gian của audio về 0
        thanhThoiGian.value = 0; // Reset thanh thời gian về 0
        document.getElementById("thoi-gian-hien-tai").textContent = "0:00"; // Cập nhật giao diện
    }

    function capNhatTrangThaiDieuKhien(hoatDong) {
        // Vô hiệu hóa hoặc kích hoạt các điều khiển
        const dieuKhienElements = [nutPhatTamDung, thanhThoiGian, thanhAmLuong, nutTatTieng];
        dieuKhienElements.forEach(el => {
            el.disabled = !hoatDong; // Vô hiệu hóa hoặc kích hoạt
        });

        // Thêm/xóa class để biểu thị trạng thái
        dieuKhien.classList.toggle('disabled', !hoatDong);
    }
});
