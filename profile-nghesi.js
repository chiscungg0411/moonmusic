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

        if (tuDongPhat) {
            audioPlayer.play();
            dangPhat = true;
            nutPhatTamDung.querySelector("i").classList.replace("fa-play", "fa-pause");
            imgSong.classList.add("xoay"); // Bắt đầu xoay ảnh
        } else {
            dangPhat = false;
            nutPhatTamDung.querySelector("i").classList.replace("fa-pause", "fa-play");
            imgSong.classList.remove("xoay"); // Dừng xoay ảnh
        }
    }

    function togglePlayPause() {
        if (dangPhat) {
            audioPlayer.pause();
            dangPhat = false;
            nutPhatTamDung.querySelector("i").classList.replace("fa-pause", "fa-play");
            imgSong.classList.remove("xoay"); // Dừng xoay ảnh
        } else {
            audioPlayer.play();
            dangPhat = true;
            nutPhatTamDung.querySelector("i").classList.replace("fa-play", "fa-pause");
            imgSong.classList.add("xoay"); // Bắt đầu xoay ảnh
        }
    }

    function phatBaiHatHienTai() {
        phatBaiHat(danhSachBaiHat[chiSoBaiHatHienTai], true);
    }

    function phatBaiNgauNhienKhongTrung() {
        const baiChuaPhat = danhSachBaiHat.map((_, index) => index).filter(i => !baiDaPhat.includes(i));

        if (baiChuaPhat.length === 0) {
            baiDaPhat = [chiSoBaiHatHienTai];
            chiSoBaiHatHienTai = baiChuaPhat[Math.floor(Math.random() * baiChuaPhat.length)];
        } else {
            chiSoBaiHatHienTai = baiChuaPhat[Math.floor(Math.random() * baiChuaPhat.length)];
            baiDaPhat.push(chiSoBaiHatHienTai);
        }

        phatBaiHat(danhSachBaiHat[chiSoBaiHatHienTai], true);
    }

    function phatBaiHatTruoc() {
        chiSoBaiHatHienTai = (chiSoBaiHatHienTai - 1 + danhSachBaiHat.length) % danhSachBaiHat.length;
        phatBaiHatHienTai();
    }

    function phatBaiHatTiepTheo() {
        chiSoBaiHatHienTai++;
        
        // Nếu đến cuối danh sách, quay lại bài đầu tiên khi ở chế độ lặp tất cả
        if (chiSoBaiHatHienTai >= danhSachBaiHat.length) {
            chiSoBaiHatHienTai = 0; // Quay lại bài đầu tiên
        }
        
        phatBaiHat(danhSachBaiHat[chiSoBaiHatHienTai], true);
    }

    function toggleCheDoLap() {
        const lapIcon = document.querySelector('.fa-rotate-right');
        cheDoLap = (cheDoLap + 1) % 3; // Lần lượt thay đổi giữa 0, 1, 2
        if (cheDoLap === 0) {
            lapIcon.style.color = ""; // Không lặp
        } else if (cheDoLap === 1) {
            lapIcon.style.color = "yellow"; // Lặp một bài
        } else if (cheDoLap === 2) {
            lapIcon.style.color = "#3ADE3E"; // Lặp tất cả
        }
    }

    function toggleMute() {
        if (dangTatTieng) {
            audioPlayer.volume = volumeCu;
            iconVolume.classList.replace("fa-volume-xmark", "fa-volume-high");
        } else {
            volumeCu = audioPlayer.volume;
            audioPlayer.volume = 0;
            iconVolume.classList.replace("fa-volume-high", "fa-volume-xmark");
        }
        dangTatTieng = !dangTatTieng;
    }

    function resetTrackInfo() {
        document.querySelector(".ten-bai-hat").textContent = "--";
        document.querySelector(".ten-nghe-si").textContent = "--";
        document.getElementById("tong-thoi-gian").textContent = "0:00";
        thanhThoiGian.value = 0;
        thanhThoiGian.max = 100;
        document.getElementById("thoi-gian-hien-tai").textContent = "0:00";
    }

    function formatTime(seconds) {
        const phut = Math.floor(seconds / 60);
        const giay = Math.floor(seconds % 60);
        return `${phut}:${giay < 10 ? '0' : ''}${giay}`;
    }

    const nutPhatNgauNhien = document.querySelector('.fa-shuffle').closest("button");
    nutPhatNgauNhien.addEventListener("click", () => {
        cheDoPhatNgauNhien = !cheDoPhatNgauNhien;

        if (cheDoPhatNgauNhien) {
            nutPhatNgauNhien.querySelector("i").style.color = "#49ADF4"; // Màu xanh khi bật phát ngẫu nhiên
            baiDaPhat = []; // Đặt lại danh sách đã phát khi bật chế độ phát ngẫu nhiên
            if (!dangPhat) {
                phatBaiNgauNhienKhongTrung();
            }
        } else {
            nutPhatNgauNhien.querySelector("i").style.color = "white";
        }
    });

    document.querySelector('.fa-step-backward').closest("button").addEventListener("click", phatBaiHatTruoc);
    document.querySelector('.fa-forward-step').closest("button").addEventListener("click", () => {
        if (cheDoPhatNgauNhien) {
            phatBaiNgauNhienKhongTrung();
        } else {
            phatBaiHatTiepTheo();
        }
    });
    document.querySelector('.fa-rotate-right').closest("button").addEventListener("click", toggleCheDoLap);

    function capNhatTrangThaiDieuKhien(hoatDong) {
        const dieuKhienElements = [dieuKhien, thanhThoiGian, thanhAmLuong, nutTatTieng];
        dieuKhienElements.forEach(el => el.classList.toggle('disabled', !hoatDong));
    }
});

