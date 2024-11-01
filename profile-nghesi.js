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
    const audioPlayer = new Audio();

    // Các biến lưu trữ trạng thái bài hát và danh sách
    const danhSachBaiHat = Array.from(document.querySelectorAll('.popular-songs .song, .popular-songs .song.hidden'));
    let chiSoBaiHatHienTai = 0;
    let dangPhat = false;
    let dangTatTieng = false;
    let volumeCu = 1;
    let cheDoLap = 0; // 0: không lặp, 1: lặp một bài, 2: lặp tất cả
    let phatNgauNhienSauKetThuc = false;
    let cheDoPhatNgauNhien = false; // Mặc định không phát ngẫu nhiên

    resetTrackInfo();

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

    nutPhatTamDung.addEventListener("click", () => togglePlayPause(!dangPhat));
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
            phatBaiHatHienTai(); // Lặp lại bài hiện tại
        } else if (cheDoLap === 2) {
            phatBaiHatTiepTheo(); // Chuyển sang bài tiếp theo hoặc quay lại đầu
        } else {
            togglePlayPause(false); // Dừng phát nhạc
        }
    });

    thanhThoiGian.addEventListener("input", () => audioPlayer.currentTime = thanhThoiGian.value);

    thanhAmLuong.addEventListener("input", () => {
        audioPlayer.volume = thanhAmLuong.value / 100;
    });

    // Thêm sự kiện click cho từng bài hát để phát nhạc khi click
    danhSachBaiHat.forEach((baiHat, index) => {
        baiHat.addEventListener('click', () => {
            chiSoBaiHatHienTai = index;
            phatBaiHat(baiHat);
            phatNgauNhienSauKetThuc = false;
        });
    });

    // Hàm phát bài nhạc
    function phatBaiHat(baiHat) {
        const title = baiHat.getAttribute('data-title');
        const artist = baiHat.getAttribute('data-artist');
        const url = baiHat.getAttribute('data-url');
        const imgSrc = baiHat.querySelector('img').src;

        document.querySelector(".ten-bai-hat").textContent = title;
        document.querySelector(".ten-nghe-si").textContent = artist;
        document.querySelector(".bia-album").src = imgSrc;
        audioPlayer.src = url;
        audioPlayer.play();
        dangPhat = true;
        nutPhatTamDung.querySelector("i").classList.replace("fa-play", "fa-pause");

        audioPlayer.addEventListener("loadedmetadata", () => {
            const tongThoiGianGiay = audioPlayer.duration;
            document.getElementById("tong-thoi-gian").textContent = formatTime(tongThoiGianGiay);
            thanhThoiGian.max = tongThoiGianGiay;
            thanhThoiGian.value = 0;
        });
    }

    function phatBaiHatHienTai() {
        phatBaiHat(danhSachBaiHat[chiSoBaiHatHienTai]);
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

    function toggleCheDoLap() {
        cheDoLap = (cheDoLap + 1) % 3;
        const lapIcon = document.querySelector('.fa-rotate-right');
        if (cheDoLap === 0) {
            lapIcon.style.color = ""; // Không lặp
        } else if (cheDoLap === 1) {
            lapIcon.style.color = "yellow"; // Lặp một bài
        } else {
            lapIcon.style.color = "#3ADE3E"; // Lặp tất cả - đổi màu sang #3ADE3E
        }
    }

    function togglePlayPause(isPlaying) {
        if (isPlaying) {
            nutPhatTamDung.querySelector("i").classList.replace("fa-play", "fa-pause");
            audioPlayer.play();
        } else {
            nutPhatTamDung.querySelector("i").classList.replace("fa-pause", "fa-play");
            audioPlayer.pause();
        }
        dangPhat = isPlaying;
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

    // Sự kiện cho nút phát ngẫu nhiên
    const nutPhatNgauNhien = document.querySelector('.fa-shuffle').closest("button");
    nutPhatNgauNhien.addEventListener("click", () => {
        cheDoPhatNgauNhien = !cheDoPhatNgauNhien; // Bật hoặc tắt chế độ phát ngẫu nhiên

        if (cheDoPhatNgauNhien) {
            nutPhatNgauNhien.querySelector("i").style.color = "#49ADF4"; // Đổi màu sang #49ADF4 khi bật phát ngẫu nhiên
            if (!dangPhat) {
                phatBaiNgauNhien(); // Phát ngay bài ngẫu nhiên nếu chưa phát
            } else {
                phatNgauNhienSauKetThuc = true; // Phát bài ngẫu nhiên sau khi bài hiện tại kết thúc
            }
        } else {
            nutPhatNgauNhien.querySelector("i").style.color = "white"; // Đổi màu về trắng khi tắt phát ngẫu nhiên
            phatNgauNhienSauKetThuc = false;
        }
    });

    document.querySelector('.fa-step-backward').closest("button").addEventListener("click", phatBaiHatTruoc);
    document.querySelector('.fa-forward-step').closest("button").addEventListener("click", phatBaiHatTiepTheo);
    document.querySelector('.fa-rotate-right').closest("button").addEventListener("click", toggleCheDoLap);
});






