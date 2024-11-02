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

    const danhSachBaiHat = Array.from(document.querySelectorAll('.popular-songs .song, .popular-songs .song.hidden'));
    let chiSoBaiHatHienTai = 0;
    let dangPhat = false;
    let dangTatTieng = false;
    let volumeCu = 1;
    let cheDoLap = 0; // 0: không lặp, 1: lặp một bài, 2: lặp tất cả
    let phatNgauNhienSauKetThuc = false;
    let cheDoPhatNgauNhien = false;

    resetTrackInfo();
    capNhatTrangThaiDieuKhien(false); // Vô hiệu hóa các điều khiển khi tải trang

    // Cập nhật hiển thị thêm/ẩn bài hát
    xemThemButton.addEventListener('click', function() {
        document.querySelectorAll('.song.hidden').forEach(function(song) {
            song.classList.remove('hidden');
        });
        this.style.display = 'none'; 
        anBotButton.style.display = 'block';
    });

    anBotButton.addEventListener('click', function() {
        document.querySelectorAll('.song').forEach(function(song, index) {
            if (index >= 5) { 
                song.classList.add('hidden');
            }
        });
        xemThemButton.style.display = 'block';
        this.style.display = 'none';
    });

    nutPhatTamDung.addEventListener("click", () => {
        togglePlayPause(!dangPhat);
        capNhatTrangThaiDieuKhien(dangPhat); // Cập nhật trạng thái điều khiển sau khi thay đổi trạng thái phát
    });
    nutTatTieng.addEventListener("click", toggleMute);

    audioPlayer.addEventListener("timeupdate", () => {
        document.getElementById("thoi-gian-hien-tai").textContent = formatTime(audioPlayer.currentTime);
        thanhAmLuong.value = audioPlayer.volume * 100;
        if (audioPlayer.duration) thanhThoiGian.value = audioPlayer.currentTime;
    });

    audioPlayer.addEventListener("ended", () => {
        if (phatNgauNhienSauKetThuc && cheDoPhatNgauNhien) {
            phatBaiNgauNhien();
        } else if (cheDoLap === 1) {
            phatBaiHatHienTai();
        } else if (cheDoLap === 2) {
            phatBaiHatTiepTheo();
        } else {
            togglePlayPause(false);
            capNhatTrangThaiDieuKhien(false); // Vô hiệu hóa điều khiển khi dừng phát nhạc
        }
    });

    thanhThoiGian.addEventListener("input", () => {
        if (dangPhat) audioPlayer.currentTime = thanhThoiGian.value;
    });

    thanhAmLuong.addEventListener("input", () => {
        if (dangPhat) audioPlayer.volume = thanhAmLuong.value / 100;
    });

    // Hiển thị thông tin bài hát và tự phát khi người dùng nhấn vào bài
    danhSachBaiHat.forEach((baiHat, index) => {
        baiHat.addEventListener('click', () => {
            chiSoBaiHatHienTai = index;
            phatBaiHat(baiHat, true); // Tự động phát khi người dùng nhấn vào bài
            phatNgauNhienSauKetThuc = false;
            capNhatTrangThaiDieuKhien(true); // Kích hoạt điều khiển khi bắt đầu phát bài
        });
    });

    // Hàm phát bài nhạc
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
        } else {
            dangPhat = false;
            nutPhatTamDung.querySelector("i").classList.replace("fa-pause", "fa-play");
        }

        audioPlayer.addEventListener("loadedmetadata", () => {
            const tongThoiGianGiay = audioPlayer.duration;
            document.getElementById("tong-thoi-gian").textContent = formatTime(tongThoiGianGiay);
            thanhThoiGian.max = tongThoiGianGiay;
            thanhThoiGian.value = 0;
        });
    }

    function phatBaiHatHienTai() {
        phatBaiHat(danhSachBaiHat[chiSoBaiHatHienTai], true);
    }

    function phatBaiNgauNhien() {
        chiSoBaiHatHienTai = Math.floor(Math.random() * danhSachBaiHat.length);
        phatBaiHatHienTai();
    }

    function phatBaiHatTruoc() {
        chiSoBaiHatHienTai = (chiSoBaiHatHienTai - 1 + danhSachBaiHat.length) % danhSachBaiHat.length;
        phatBaiHatHienTai();
    }

    function phatBaiHatTiepTheo() {
        chiSoBaiHatHienTai = (chiSoBaiHatHienTai + 1) % danhSachBaiHat.length;
        phatBaiHatHienTai();
    }

    audioPlayer.addEventListener('ended', phatBaiHatTiepTheo);

    function toggleCheDoLap() {
        cheDoLap = (cheDoLap + 1) % 3;
        const lapIcon = document.querySelector('.fa-rotate-right');
        if (cheDoLap === 0) {
            lapIcon.style.color = ""; // Không lặp
        } else if (cheDoLap === 1) {
            lapIcon.style.color = "yellow"; // Lặp một bài
        } else {
            lapIcon.style.color = "#3ADE3E"; // Lặp tất cả
        }
    }

    function togglePlayPause(isPlaying) {
        if (isPlaying && audioPlayer.src) {
            nutPhatTamDung.querySelector("i").classList.replace("fa-play", "fa-pause");
            audioPlayer.play();
        } else {
            nutPhatTamDung.querySelector("i").classList.replace("fa-pause", "fa-play");
            audioPlayer.pause();
        }
        dangPhat = isPlaying;
        capNhatTrangThaiDieuKhien(dangPhat); // Cập nhật trạng thái điều khiển
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
            nutPhatNgauNhien.querySelector("i").style.color = "#49ADF4";
            if (!dangPhat) {
                phatBaiNgauNhien();
            } else {
                phatNgauNhienSauKetThuc = true;
            }
        } else {
            nutPhatNgauNhien.querySelector("i").style.color = "white";
            phatNgauNhienSauKetThuc = false;
        }
    });

    document.querySelector('.fa-step-backward').closest("button").addEventListener("click", phatBaiHatTruoc);
    document.querySelector('.fa-forward-step').closest("button").addEventListener("click", phatBaiHatTiepTheo);
    document.querySelector('.fa-rotate-right').closest("button").addEventListener("click", toggleCheDoLap);

    function capNhatTrangThaiDieuKhien(hoatDong) {
        if (hoatDong) {
            dieuKhien.classList.remove('disabled');
            thanhThoiGian.classList.remove('disabled');
            thanhAmLuong.classList.remove('disabled');
        } else {
            dieuKhien.classList.add('disabled');
            thanhThoiGian.classList.add('disabled');
            thanhAmLuong.classList.add('disabled');
        }
    }
});