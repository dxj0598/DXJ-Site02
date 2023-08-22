const musicBoxes = document.querySelectorAll('.music-box');
const nowPlayingCover = document.querySelector('.now-playing .album-cover');
const nowPlayingLyrics = document.querySelector('.now-playing .lyrics');
const nowPlayingTitle = document.querySelector('.now-playing .song-title');
const player = document.getElementById('player');

let currentLyrics = [];
let currentLineIndex = 0;

async function fetchLyrics(url) {
    const response = await fetch(url);
    const text = await response.text();
    const parsed = lrcParser(text);
    return parsed.scripts;
}

const nowPlayingNextLyrics = document.createElement('p');
nowPlayingNextLyrics.classList.add('next-lyrics');
nowPlayingLyrics.parentNode.appendChild(nowPlayingNextLyrics);

musicBoxes.forEach((box) => {
    if (box.classList.contains('now-playing')) return;

    const cover = box.querySelector('.album-cover').style.backgroundImage.match(/url\("(.+)"\)/)[1];
    const title = box.querySelector('.song-title').textContent;
    const songUrl = box.dataset.songUrl;
    const lyricsUrl = box.dataset.lyricsUrl;

    box.addEventListener('click', async () => {
        nowPlayingCover.style.backgroundImage = `url(${cover})`;
        nowPlayingTitle.textContent = title;

        player.src = songUrl;
        player.play();

        currentLyrics = await fetchLyrics(lyricsUrl);
        currentLineIndex = 0;

        nowPlayingLyrics.textContent = '加载歌词中...';
        nowPlayingNextLyrics.textContent = '';
    });
});

player.ontimeupdate = () => {
    if (player.currentTime > currentLyrics[currentLineIndex].time) {
        nowPlayingLyrics.textContent = currentLyrics[currentLineIndex].text;

        if (currentLyrics[currentLineIndex + 1]) {
            nowPlayingNextLyrics.textContent = currentLyrics[currentLineIndex + 1].text;
        } else {
            nowPlayingNextLyrics.textContent = ''; // Hide if there's no next line
        }
        currentLineIndex++;
    }
};

player.onended = () => {
    nowPlayingLyrics.textContent = "歌曲播放完毕";
    nowPlayingNextLyrics.textContent = "";
};
