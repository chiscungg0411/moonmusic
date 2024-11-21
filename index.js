document.addEventListener('DOMContentLoaded', function () {
    const xemThemButton = document.querySelector('.xem-them');
    const anBotButton = document.querySelector('.an-bot');
    const nutPhatTamDung = document.getElementById("phat-tam-dung");
    const nutTatTieng = document.getElementById("nut-tat-tieng");
    const iconVolume = document.getElementById("icon-volume");
    const thanhAmLuong = document.getElementById("thanh-am-luong");
    const thanhThoiGian = document.getElementById("thanh-thoi-gian");
    const dieuKhien = document.querySelector(".dieu-khien");
    const audioPlayer = new Audio();
    const imgSong = document.querySelector('.thong-tin-bai-hat img');
    const danhSachBaiHat = Array.from(document.querySelectorAll('.popular-songs .song, .popular-songs .song.hidden'));
    let chiSoBaiHatHienTai = 0;
    let dangPhat = false;
    let dangTatTieng = false;
    let volumeCu = 1;
    let cheDoLap = 0; // 0: Không lặp, 1: Lặp một bài, 2: Lặp tất cả
    let cheDoPhatNgauNhien = false;
    let baiDaPhat = []; // Mảng lưu trữ các chỉ số bài hát đã phát

    // Khôi phục trạng thái từ sessionStorage
    if (sessionStorage.getItem('currentSong')) {
        const currentSong = JSON.parse(sessionStorage.getItem('currentSong'));
        audioPlayer.src = currentSong.url;
        chiSoBaiHatHienTai = currentSong.index;
        if (currentSong.isPlaying) {
            audioPlayer.play();
            dangPhat = true;
        }
    }

    resetTrackInfo();
    capNhatTrangThaiDieuKhien(false); // Vô hiệu hóa các điều khiển khi tải trang

    xemThemButton.addEventListener('click', function () {
        document.querySelectorAll('.song.hidden').forEach(song => song.classList.remove('hidden'));
        this.style.display = 'none';
        anBotButton.style.display = 'block';
    });

    anBotButton.addEventListener('click', function () {
        document.querySelectorAll('.song').forEach((song, index) => {
            if (index >= 5) song.classList.add('hidden');
        });
        xemThemButton.style.display = 'block';
        this.style.display = 'none';
    });

    nutPhatTamDung.addEventListener("click", togglePlayPause);
    nutTatTieng.addEventListener("click", toggleMute);

    audioPlayer.addEventListener("timeupdate", () => {
        document.getElementById("thoi-gian-hien-tai").textContent = formatTime(audioPlayer.currentTime);
        thanhAmLuong.value = audioPlayer.volume * 100;
        if (audioPlayer.duration) thanhThoiGian.value = audioPlayer.currentTime;
    });

    audioPlayer.addEventListener("loadedmetadata", () => {
        // Cập nhật thời gian tổng khi bài hát tải xong
        document.getElementById("tong-thoi-gian").textContent = formatTime(audioPlayer.duration);
        thanhThoiGian.max = audioPlayer.duration;
        thanhThoiGian.value = 0;
    });

    audioPlayer.addEventListener("ended", () => {
        if (cheDoLap === 1) {
            phatBaiHatHienTai(); // Lặp lại bài hiện tại
        } else if (cheDoPhatNgauNhien) {
            phatBaiNgauNhienKhongTrung(); // Phát bài ngẫu nhiên không trùng
        } else if (cheDoLap === 2) {
            phatBaiHatTiepTheo(); // Lặp lại tất cả từ đầu nếu đến cuối
        } else {
            phatBaiHatTiepTheo(); // Chuyển sang bài tiếp theo nếu không ở chế độ lặp
        }
    });

    thanhThoiGian.addEventListener("input", () => {
        if (dangPhat) audioPlayer.currentTime = thanhThoiGian.value;
    });

    thanhAmLuong.addEventListener("input", () => {
        if (dangPhat) audioPlayer.volume = thanhAmLuong.value / 100;
    });

    danhSachBaiHat.forEach((baiHat, index) => {
        baiHat.addEventListener('click', () => {
            chiSoBaiHatHienTai = index;
            phatBaiHat(baiHat, true); // Tự động phát khi người dùng nhấn vào bài
            capNhatTrangThaiDieuKhien(true); // Kích hoạt điều khiển khi bắt đầu phát bài
        });
    });

    function phatBaiHat(baiHat, tuDongPhat = false) {
        const title = baiHat.getAttribute('data-title');
        const artist = baiHat.getAttribute('data-artist');
        const url = baiHat.getAttribute('data-url');
        const imgSrc = baiHat.querySelector('img').src;
        document.querySelector(".ten-bai-hat").textContent = title;
        document.querySelector(".ten-nghe-si").textContent = artist;
        document.querySelector(".bia-album").src = imgSrc;
        audioPlayer.src = url;

       

