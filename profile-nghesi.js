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
});

document.addEventListener('DOMContentLoaded', function () {
    const nutPhat = document.querySelectorAll(".play-button");
    const thanhNhac = document.querySelector(".trinh-phat");
    const nutPhatTamDung = document.getElementById("phat-tam-dung");
    const nutTatTieng = document.getElementById("nut-tat-tieng");
    const iconVolume = document.getElementById("icon-volume");
    const thanhAmLuong = document.getElementById("thanh-am-luong");
    const thanhThoiGian = document.getElementById("thanh-thoi-gian");
    const audioPlayer = new Audio();

    let dangPhat = false;
    let dangTatTieng = false;
    let volumeCu = 1;

    resetTrackInfo();

    nutPhat.forEach(button => {
        button.addEventListener("click", () => {
            thanhNhac.style.display = "flex";
            phatBaiHat("Sắp Nổi Tiếng", "HIEUTHUHAI", "https://cdn.glitch.global/f9a3cc04-0b49-46cb-84b6-5390f34696dc/HIEUTHUHAI%20-%20S%E1%BA%AFp%20N%E1%BB%93i%20Ti%E1%BA%BFng%20(prod.%20by%20Kewtiie)%20%5BOfficial%20Lyric%20Video%5D.mp3?v=1730224508456", "https://cdn.glitch.global/f9a3cc04-0b49-46cb-84b6-5390f34696dc/3afd1dd4-5f9e-4173-bcc1-a2d6fe0110db.image.png?v=1730437193455");
        });
    });

    nutPhatTamDung.addEventListener("click", () => togglePlayPause(!dangPhat));
    nutTatTieng.addEventListener("click", toggleMute);

    audioPlayer.addEventListener("timeupdate", () => {
        document.getElementById("thoi-gian-hien-tai").textContent = formatTime(audioPlayer.currentTime);
        thanhAmLuong.value = audioPlayer.volume * 100;
        if (audioPlayer.duration) thanhThoiGian.value = audioPlayer.currentTime;
    });

    audioPlayer.addEventListener("ended", () => togglePlayPause(false));
    thanhThoiGian.addEventListener("input", () => audioPlayer.currentTime = thanhThoiGian.value);

    // Thay đổi ở đây: Chọn cả .song và .song.hidden
    const songs = document.querySelectorAll('.song, .song.hidden');
    songs.forEach(song => {
        song.addEventListener('click', () => {
            const title = song.getAttribute('data-title');
            const artist = song.getAttribute('data-artist');
            const url = song.getAttribute('data-url');
            const imgSrc = song.querySelector('img').src; // Lấy link hình ảnh của bài nhạc
            
            thanhNhac.style.display = "flex";
            phatBaiHat(title, artist, url, imgSrc);
        });
    });

    function resetTrackInfo() {
        document.querySelector(".ten-bai-hat").textContent = "--";
        document.querySelector(".ten-nghe-si").textContent = "--";
        document.getElementById("tong-thoi-gian").textContent = "0:00";
        thanhThoiGian.value = 0;
        thanhThoiGian.max = 100;
        document.getElementById("thoi-gian-hien-tai").textContent = "0:00";
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

    function phatBaiHat(tenBaiHat, tenNgheSi, duongDan, imgSrc) {
        document.querySelector(".ten-bai-hat").textContent = tenBaiHat;
        document.querySelector(".ten-nghe-si").textContent = tenNgheSi;
        document.querySelector(".bia-album").src = imgSrc; // Đặt hình ảnh của bài nhạc
        audioPlayer.src = duongDan;
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

    function formatTime(seconds) {
        const phut = Math.floor(seconds / 60);
        const giay = Math.floor(seconds % 60);
        return `${phut}:${giay < 10 ? '0' : ''}${giay}`;
    }

    thanhAmLuong.addEventListener("input", () => {
        audioPlayer.volume = thanhAmLuong.value / 100;
    });
});

