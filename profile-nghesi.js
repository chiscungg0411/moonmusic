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

