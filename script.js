document.addEventListener('DOMContentLoaded', () => {
  const card = document.getElementById('profileCard');
  const toast = document.getElementById('toast');
  const avatarBox = document.getElementById('avatarBox');
  const avatarVideo = document.getElementById('avatarVideo');

  document.body.setAttribute('data-theme', 'blood');

  const statusIcon = document.getElementById('statusIcon');
  const statusText = document.getElementById('statusText');
  const statusDot = document.getElementById('statusDot');
  const statusPill = document.getElementById('statusPill');

  function updateEkbStatus() {
    if (!statusText) return;
    const now = new Date();

    let ekbTimeStr = '';
    let ekbHour = 12;

    try {
      const timeFmt = new Intl.DateTimeFormat('ru-RU', {
        timeZone: 'Asia/Yekaterinburg',
        hour: '2-digit',
        minute: '2-digit'
      });
      ekbTimeStr = timeFmt.format(now);

      const hourFmt = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Yekaterinburg',
        hour: 'numeric',
        hour12: false
      });
      ekbHour = parseInt(hourFmt.format(now), 10);
    } catch (e) {

      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const ekbDate = new Date(utc + (3600000 * 5));
      const h = String(ekbDate.getHours()).padStart(2, '0');
      const m = String(ekbDate.getMinutes()).padStart(2, '0');
      ekbTimeStr = `${h}:${m}`;
      ekbHour = ekbDate.getHours();
    }

    if (ekbHour >= 2 && ekbHour < 8) {
      if (statusIcon) statusIcon.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" stroke="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      if (statusDot) statusDot.className = 'status-dot sleep';
    } else {
      if (statusIcon) statusIcon.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c-.6 1.2-2 2.6-2 4.2a2 2 0 0 0 4 0c0-1.6-1.4-3-2-4.2z" fill="currentColor"/><line x1="12" y1="6.5" x2="12" y2="10"/><rect x="8" y="10" width="8" height="11" rx="1.5"/></svg>';
      if (statusDot) statusDot.className = 'status-dot awake';
    }
    statusText.innerHTML = `Моё время &middot; ${ekbTimeStr} <span class="tz-badge">ЕКБ</span>`;
  }

  updateEkbStatus();
  setInterval(updateEkbStatus, 15000);

  if (statusPill) {
    statusPill.addEventListener('click', () => {
      showToast('Местное время: Екатеринбург (UTC+5)');
    });
  }

  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  document.querySelectorAll('.copy-seal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const parentLink = btn.closest('.gothic-btn');
      const textToCopy = parentLink.getAttribute('data-copy') || parentLink.querySelector('.btn-sub')?.textContent;

      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Печать сохранена: ${textToCopy}`);
        }).catch(() => {
          showToast('Не удалось перенести печать');
        });
      }
    });
  });

  if (avatarVideo && avatarBox) {
    avatarVideo.play().catch(() => {});

    avatarBox.addEventListener('click', () => {
      if (avatarVideo.paused) {
        avatarVideo.play();
        showToast('Воспроизведение видео');
      } else {
        avatarVideo.muted = !avatarVideo.muted;
        if (!avatarVideo.muted) {
          avatarVideo.volume = 0.8;
          showToast('Звук аватара: ВКЛ');
        } else {
          showToast('Звук аватара: ВЫКЛ');
        }
      }
    });
  }

  const playlist = [
    {
      title: "Ghost — Mary On A Cross",
      src: "tracks/Ghost - Mary On A Cross.mp3",
      tag: "Occult Rock"
    },
    {
      title: "And One — Military Fashion Show",
      src: "tracks/And One - Military Fashion Show.mp3",
      tag: "EBM / Synthpop"
    },
    {
      title: "AND ONE — Girls on Girls",
      src: "tracks/AND ONE - Girls on Girls.mp3",
      tag: "Dark Synthpop"
    },
    {
      title: "ximora, evo9 — силикон и ботокс",
      src: "tracks/ximora, evo9 - силикон и ботокс.mp3",
      tag: "Post-Punk / Alternative"
    },
    {
      title: "ximora — статус Vk0ntakt3",
      src: "tracks/ximora - статус Vk0ntakt3.mp3",
      tag: "Underground / Vibe"
    },
    {
      title: "ximora — моей принцессе мерзко от меня",
      src: "tracks/ximora - моей принцессе мерзко от меня.mp3",
      tag: "Depressive Post-Punk"
    },
    {
      title: "Bauhaus — She's in Parties",
      src: "tracks/Bauhaus - She is in Parties.mp3",
      tag: "Goth Rock Legend"
    }
  ];

  let currentTrackIdx = 0;

  const bgAudio = document.getElementById('bgAudio');
  const musicPlayBtn = document.getElementById('musicPlayBtn');
  const playIcon = document.getElementById('playIcon');
  const prevTrackBtn = document.getElementById('prevTrackBtn');
  const nextTrackBtn = document.getElementById('nextTrackBtn');
  const musicPlayer = document.getElementById('musicPlayer');
  const musicMuteBtn = document.getElementById('musicMuteBtn');
  const musicVolume = document.getElementById('musicVolume');
  const musicSub = document.getElementById('musicSub');
  const trackName = document.getElementById('trackName');
  const musicSeekContainer = document.getElementById('musicSeekContainer');
  const musicSeekFill = document.getElementById('musicSeekFill');

  const playlistDrawer = document.getElementById('playlistDrawer');
  const playlistToggleBtn = document.getElementById('playlistToggleBtn');
  const playlistCloseBtn = document.getElementById('playlistCloseBtn');
  const playlistList = document.getElementById('playlistList');
  const playlistBadge = document.getElementById('playlistBadge');

  if (bgAudio && musicPlayBtn) {
    bgAudio.volume = parseFloat(musicVolume?.value) || 0.7;

    function renderPlaylist() {
      if (!playlistList) return;
      playlistList.innerHTML = '';

      playlist.forEach((track, idx) => {
        const item = document.createElement('div');
        item.className = `playlist-item ${idx === currentTrackIdx ? 'active' : ''}`;
        item.innerHTML = `
          <div class="playlist-item-left">
            <span class="playlist-item-idx">${String(idx + 1).padStart(2, '0')}</span>
            <div class="playlist-item-info">
              <span class="playlist-item-title">${track.title}</span>
              <span class="playlist-item-tag">${track.tag}</span>
            </div>
          </div>
          <span class="playlist-item-status">${idx === currentTrackIdx ? '▶' : ''}</span>
        `;

        item.addEventListener('click', () => {
          loadTrack(idx, true);
        });

        playlistList.appendChild(item);
      });

      if (playlistBadge) {
        playlistBadge.textContent = `${currentTrackIdx + 1}/${playlist.length}`;
      }
    }

    const playSvgHtml = `<svg class="play-svg" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>`;
    const pauseSvgHtml = `<svg class="play-svg" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="4" height="16" rx="1"></rect><rect x="15" y="4" width="4" height="16" rx="1"></rect></svg>`;
    const volOnSvgHtml = `<svg class="vol-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`;
    const volMuteSvgHtml = `<svg class="vol-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;

    const volIconBox = document.getElementById('volIconBox');

    function loadTrack(index, autoPlay = false) {
      currentTrackIdx = (index + playlist.length) % playlist.length;
      const currentTrack = playlist[currentTrackIdx];

      bgAudio.preload = 'auto';
      bgAudio.src = currentTrack.src;
      trackName.textContent = currentTrack.title;
      if (musicSeekFill) musicSeekFill.style.width = '0%';
      renderPlaylist();

      if (autoPlay) {
        bgAudio.play().then(() => {
          musicPlayer.classList.add('playing');
          playIcon.innerHTML = pauseSvgHtml;
          showToast(`Играет: ${currentTrack.title}`);
        }).catch(() => {
          showToast('Нажми Play для звука');
        });
      }
    }

    loadTrack(0, false);

    function formatTime(seconds) {
      if (isNaN(seconds)) return '0:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
      return `${mins}:${secs}`;
    }

    function togglePlay() {
      if (bgAudio.paused) {
        bgAudio.play().then(() => {
          musicPlayer.classList.add('playing');
          playIcon.innerHTML = pauseSvgHtml;
          showToast(`Играет: ${playlist[currentTrackIdx].title}`);
        }).catch(() => {
          showToast('Нажми ещё раз для звука');
        });
      } else {
        bgAudio.pause();
        musicPlayer.classList.remove('playing');
        playIcon.innerHTML = playSvgHtml;
        showToast('Пауза');
      }
    }

    musicPlayBtn.addEventListener('click', togglePlay);

    if (prevTrackBtn) {
      prevTrackBtn.addEventListener('click', () => {
        loadTrack(currentTrackIdx - 1, true);
      });
    }

    if (nextTrackBtn) {
      nextTrackBtn.addEventListener('click', () => {
        loadTrack(currentTrackIdx + 1, true);
      });
    }

    bgAudio.addEventListener('ended', () => {
      loadTrack(currentTrackIdx + 1, true);
    });

    let isScrubbing = false;
    let lastSeekTime = 0;

    function applySeek(e) {
      if (!musicSeekContainer || !bgAudio.duration || isNaN(bgAudio.duration)) return;
      const rect = musicSeekContainer.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : null);
      if (clientX === null) return;

      const clickX = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      const targetTime = Math.min(bgAudio.duration - 0.2, percentage * bgAudio.duration);

      lastSeekTime = Date.now();

      if (musicSeekFill) {
        musicSeekFill.style.width = `${percentage * 100}%`;
      }

      try {
        if (isFinite(targetTime)) {
          bgAudio.currentTime = targetTime;
        }
      } catch (err) {
        console.error('Audio seek error:', err);
      }

      const current = formatTime(targetTime);
      const total = formatTime(bgAudio.duration);
      if (musicSub) {
        musicSub.textContent = `${current} / ${total} · ${playlist[currentTrackIdx].tag}`;
      }
    }

    if (musicSeekContainer) {

      musicSeekContainer.addEventListener('click', (e) => {
        e.stopPropagation();
        applySeek(e);
      });

      musicSeekContainer.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        isScrubbing = true;
        musicSeekContainer.classList.add('scrubbing');
        applySeek(e);
      });

      window.addEventListener('mousemove', (e) => {
        if (isScrubbing) {
          applySeek(e);
        }
      });

      window.addEventListener('mouseup', () => {
        if (isScrubbing) {
          isScrubbing = false;
          lastSeekTime = Date.now();
          musicSeekContainer.classList.remove('scrubbing');
        }
      });

      musicSeekContainer.addEventListener('touchstart', (e) => {
        isScrubbing = true;
        musicSeekContainer.classList.add('scrubbing');
        applySeek(e);
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (isScrubbing) {
          applySeek(e);
        }
      }, { passive: true });

      window.addEventListener('touchend', () => {
        if (isScrubbing) {
          isScrubbing = false;
          lastSeekTime = Date.now();
          musicSeekContainer.classList.remove('scrubbing');
        }
      });
    }

    bgAudio.addEventListener('timeupdate', () => {
      const current = formatTime(bgAudio.currentTime);
      const total = formatTime(bgAudio.duration);
      musicSub.textContent = `${current} / ${total} · ${playlist[currentTrackIdx].tag}`;

      if (!isScrubbing && (Date.now() - lastSeekTime > 400) && bgAudio.duration && musicSeekFill) {
        const progress = (bgAudio.currentTime / bgAudio.duration) * 100;
        musicSeekFill.style.width = `${progress}%`;
      }
    });

    if (musicVolume) {
      musicVolume.addEventListener('input', (e) => {
        bgAudio.volume = parseFloat(e.target.value);
        if (bgAudio.volume === 0) {
          if (volIconBox) volIconBox.innerHTML = volMuteSvgHtml;
        } else {
          if (volIconBox) volIconBox.innerHTML = volOnSvgHtml;
        }
      });
    }

    if (musicMuteBtn) {
      let prevVolume = 0.7;
      musicMuteBtn.addEventListener('click', () => {
        if (bgAudio.volume > 0) {
          prevVolume = bgAudio.volume;
          bgAudio.volume = 0;
          musicVolume.value = 0;
          if (volIconBox) volIconBox.innerHTML = volMuteSvgHtml;
        } else {
          bgAudio.volume = prevVolume || 0.7;
          musicVolume.value = bgAudio.volume;
          if (volIconBox) volIconBox.innerHTML = volOnSvgHtml;
        }
      });
    }

    if (playlistToggleBtn && playlistDrawer) {
      playlistToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playlistDrawer.classList.toggle('open');
      });
    }

    if (playlistCloseBtn && playlistDrawer) {
      playlistCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playlistDrawer.classList.remove('open');
      });
    }

    document.addEventListener('click', (e) => {
      if (playlistDrawer && playlistDrawer.classList.contains('open')) {
        if (!playlistDrawer.contains(e.target) && !playlistToggleBtn.contains(e.target)) {
          playlistDrawer.classList.remove('open');
        }
      }
    });
  }

  const tabBtnProfile = document.getElementById('tabBtnProfile');
  const tabBtnDossier = document.getElementById('tabBtnDossier');
  const tabBtnProjects = document.getElementById('tabBtnProjects');
  const tabBtnAllies = document.getElementById('tabBtnAllies');
  const portalProjectsToAllies = document.getElementById('portalProjectsToAllies');
  const portalAlliesToProfile = document.getElementById('portalAlliesToProfile');
  const portalAlliesToAlbums = document.getElementById('portalAlliesToAlbums');

  const portalToDossier = document.getElementById('portalToDossier');
  const portalToProjects = document.getElementById('portalToProjects');
  const returnToProfileBtn = document.getElementById('returnToProfileBtn');
  const portalGarageToProjects = document.getElementById('portalGarageToProjects');
  const returnFromProjectsToProfile = document.getElementById('returnFromProjectsToProfile');
  const portalProjectsToGarage = document.getElementById('portalProjectsToGarage');

  const pageMap = {
    pageProfile: {
      el: document.getElementById('pageProfile'),
      tab: tabBtnProfile,
      toast: 'Гримуар Профиля: YaFicus'
    },
    pageDossier: {
      el: document.getElementById('pageDossier'),
      tab: tabBtnDossier,
      toast: 'Боевой Гараж: Canyon Torque 29 CF'
    },
    pageProjects: {
      el: document.getElementById('pageProjects'),
      tab: tabBtnProjects,
      toast: 'Музыкальный Гримуар: Альбомы'
    },
    pageAllies: {
      el: document.getElementById('pageAllies'),
      tab: tabBtnAllies,
      toast: 'Близкий Круг: Друзья'
    }
  };

  function switchGrimoirePage(targetId) {
    if (!pageMap[targetId]) targetId = 'pageProfile';

    Object.keys(pageMap).forEach(key => {
      const page = pageMap[key];
      if (key === targetId) {
        if (page.el) {
          page.el.style.display = 'block';
          page.el.classList.add('active');
        }
        if (page.tab) page.tab.classList.add('active');
      } else {
        if (page.el) {
          page.el.style.display = 'none';
          page.el.classList.remove('active');
        }
        if (page.tab) page.tab.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (pageMap[targetId] && pageMap[targetId].toast) {
      showToast(pageMap[targetId].toast);
    }
  }

  if (tabBtnProfile) tabBtnProfile.addEventListener('click', () => switchGrimoirePage('pageProfile'));
  if (tabBtnDossier) tabBtnDossier.addEventListener('click', () => switchGrimoirePage('pageDossier'));
  if (tabBtnProjects) tabBtnProjects.addEventListener('click', () => switchGrimoirePage('pageProjects'));
  if (tabBtnAllies) tabBtnAllies.addEventListener('click', () => switchGrimoirePage('pageAllies'));

  if (portalToDossier) portalToDossier.addEventListener('click', () => switchGrimoirePage('pageDossier'));
  if (portalToProjects) portalToProjects.addEventListener('click', () => switchGrimoirePage('pageProjects'));
  if (returnToProfileBtn) returnToProfileBtn.addEventListener('click', () => switchGrimoirePage('pageProfile'));
  if (portalGarageToProjects) portalGarageToProjects.addEventListener('click', () => switchGrimoirePage('pageProjects'));
  if (returnFromProjectsToProfile) returnFromProjectsToProfile.addEventListener('click', () => switchGrimoirePage('pageProfile'));
  if (portalProjectsToGarage) portalProjectsToGarage.addEventListener('click', () => switchGrimoirePage('pageDossier'));
  if (portalProjectsToAllies) portalProjectsToAllies.addEventListener('click', () => switchGrimoirePage('pageAllies'));
  if (portalAlliesToProfile) portalAlliesToProfile.addEventListener('click', () => switchGrimoirePage('pageProfile'));
  if (portalAlliesToAlbums) portalAlliesToAlbums.addEventListener('click', () => switchGrimoirePage('pageProjects'));
  document.querySelectorAll('.back-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => switchGrimoirePage('pageProfile'));
  });

  const filterPills = document.querySelectorAll('.filter-pill');
  const projectCards = document.querySelectorAll('.project-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'pageFadeIn 0.35s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  function handleHashNavigation() {
    const hash = window.location.hash.toLowerCase();
    if (['#garage', '#dossier', '#bike', '#canyon'].includes(hash)) {
      switchGrimoirePage('pageDossier');
    } else if (['#albums', '#music', '#vk', '#playlist', '#projects', '#forge', '#sound'].includes(hash)) {
      switchGrimoirePage('pageProjects');
    } else if (['#circle', '#friends', '#krug', '#close', '#allies', '#thanks', '#credits'].includes(hash)) {
      switchGrimoirePage('pageAllies');
    } else if (['#profile', '', '#'].includes(hash)) {
      switchGrimoirePage('pageProfile');
    }
  }

  handleHashNavigation();
  window.addEventListener('hashchange', handleHashNavigation);

  const canvas = document.getElementById('emberCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    class ConstellationNetwork {
      constructor() {
        this.nodes = [];
        this.connections = [];
        this.rebuild();
      }

      rebuild() {
        this.nodes = [];
        this.connections = [];

        const gridStep = 56;
        const cols = Math.max(4, Math.floor(width / gridStep));
        const rows = Math.max(4, Math.floor(height / gridStep));

        const starCenterX = width > 900 ? width * 0.82 : width * 0.88;
        const starCenterY = height > 700 ? height * 0.22 : 120;

        const starArcaneOffsets = [
          { dx: 0, dy: 0, size: 2.8, isCenter: true },
          { dx: -45, dy: -35, size: 1.8 },
          { dx: 40, dy: -40, size: 1.8 },
          { dx: 55, dy: 22, size: 1.6 },
          { dx: 26, dy: 62, size: 1.7 },
          { dx: -35, dy: 55, size: 1.8 },
          { dx: -58, dy: 10, size: 1.5 },
          { dx: -12, dy: -58, size: 1.6 }
        ];

        starArcaneOffsets.forEach((pt, idx) => {
          this.nodes.push({
            x: Math.max(20, Math.min(width - 20, starCenterX + pt.dx)),
            y: Math.max(20, Math.min(height - 20, starCenterY + pt.dy)),
            size: pt.size,
            baseAlpha: pt.isCenter ? 0.38 : 0.22,
            twinklePhase: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.016 + Math.random() * 0.014,
            isCenter: !!pt.isCenter
          });

          if (!pt.isCenter) {
            this.connections.push([0, idx]);
            if (idx > 1) {
              this.connections.push([idx - 1, idx]);
            }
          }
        });
        this.connections.push([7, 1]);

        const scatteredCount = Math.min(22, Math.max(10, Math.floor((width * height) / 55000)));
        const startIndex = this.nodes.length;

        for (let i = 0; i < scatteredCount; i++) {
          const col = Math.floor(Math.random() * cols);
          const row = Math.floor(Math.random() * rows);
          const nx = col * gridStep;
          const ny = row * gridStep;

          this.nodes.push({
            x: nx,
            y: ny,
            size: Math.random() * 1.2 + 1.2,
            baseAlpha: Math.random() * 0.16 + 0.1,
            twinklePhase: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.012 + Math.random() * 0.018,
            isCenter: false
          });
        }

        for (let i = startIndex; i < this.nodes.length; i++) {
          let conns = 0;
          for (let j = i + 1; j < this.nodes.length; j++) {
            const dx = this.nodes[i].x - this.nodes[j].x;
            const dy = this.nodes[i].y - this.nodes[j].y;
            const dist = Math.hypot(dx, dy);
            if (dist < 140 && conns < 2) {
              this.connections.push([i, j]);
              conns++;
            }
          }
        }
      }

      update() {
        for (let i = 0; i < this.nodes.length; i++) {
          this.nodes[i].twinklePhase += this.nodes[i].twinkleSpeed;
        }
      }

      draw() {
        ctx.save();

        ctx.lineWidth = 0.8;
        for (let i = 0; i < this.connections.length; i++) {
          const [aIdx, bIdx] = this.connections[i];
          const a = this.nodes[aIdx];
          const b = this.nodes[bIdx];
          if (!a || !b) continue;

          const avgAlpha = (Math.sin(a.twinklePhase) + Math.sin(b.twinklePhase)) * 0.02 + 0.038;
          ctx.strokeStyle = `rgba(239, 68, 68, ${Math.max(0.012, avgAlpha)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }

        for (let i = 0; i < this.nodes.length; i++) {
          const node = this.nodes[i];
          const twinkle = Math.sin(node.twinklePhase);
          const alpha = Math.max(0.04, node.baseAlpha + twinkle * 0.18);

          ctx.globalAlpha = alpha;
          ctx.fillStyle = node.isCenter ? '#fca5a5' : '#ef4444';
          ctx.shadowBlur = node.isCenter ? 7 : 3.5;
          ctx.shadowColor = '#dc2626';

          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
          ctx.fill();

          if (twinkle > 0.72) {
            const flare = (twinkle - 0.72) * 10 * (node.size / 2);
            ctx.strokeStyle = 'rgba(254, 202, 202, 0.55)';
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(node.x - flare, node.y);
            ctx.lineTo(node.x + flare, node.y);
            ctx.moveTo(node.x, node.y - flare);
            ctx.lineTo(node.x, node.y + flare);
            ctx.stroke();
          }
        }

        ctx.restore();
      }
    }

    class RainDrop {
      constructor(isBlood = false) {
        this.isBlood = isBlood;
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * (width + 80) - 40;
        this.y = init ? Math.random() * height : -35;
        if (this.isBlood) {

          this.speedY = Math.random() * 2.8 + 3.8;
          this.speedX = 0.25 + Math.random() * 0.25;
          this.length = Math.random() * 18 + 24;
          this.headRadius = Math.random() * 0.6 + 1.4;
          this.alpha = Math.random() * 0.22 + 0.45;
        } else {

          this.speedY = Math.random() * 5.5 + 13.5;
          this.speedX = 0.8 + Math.random() * 0.4;
          this.length = Math.random() * 12 + 16;
          this.alpha = Math.random() * 0.08 + 0.07;
        }
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.y > height + 40 || this.x > width + 40) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        if (this.isBlood) {
          ctx.globalAlpha = this.alpha;
          ctx.shadowBlur = 4.5;
          ctx.shadowColor = '#dc2626';

          const grad = ctx.createLinearGradient(
            this.x - this.speedX * 1.8, this.y - this.length,
            this.x, this.y
          );
          grad.addColorStop(0, 'rgba(220, 38, 38, 0)');
          grad.addColorStop(0.65, 'rgba(220, 38, 38, 0.4)');
          grad.addColorStop(1, 'rgba(239, 68, 68, 0.85)');

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.35;
          ctx.beginPath();
          ctx.moveTo(this.x - this.speedX * 1.8, this.y - this.length);
          ctx.lineTo(this.x, this.y);
          ctx.stroke();

          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.headRadius, 0, Math.PI * 2);
          ctx.fill();
        } else {

          ctx.globalAlpha = this.alpha;
          ctx.strokeStyle = 'rgba(195, 205, 225, 0.65)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(this.x - this.speedX * 1.4, this.y - this.length);
          ctx.lineTo(this.x, this.y);
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    class Ember {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : height + 10;
        this.size = Math.random() * 2 + 1;
        this.speedY = Math.random() * 0.65 + 0.35;
        this.speedX = (Math.random() - 0.5) * 0.35;
        this.alpha = Math.random() * 0.5 + 0.22;
        this.fadeSpeed = Math.random() * 0.003 + 0.0015;
        this.color = Math.random() > 0.3 ? '#ef4444' : '#f87171';
        this.oscillation = Math.random() * Math.PI * 2;
        this.oscSpeed = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.y -= this.speedY;
        this.oscillation += this.oscSpeed;
        this.x += this.speedX + Math.sin(this.oscillation) * 0.25;

        this.alpha -= this.fadeSpeed;
        if (this.y < -10 || this.alpha <= 0) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.size * 3.5;
        ctx.shadowColor = '#dc2626';

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const constellations = new ConstellationNetwork();
    const raindrops = [];
    const embers = [];

    const rainCount = Math.min(55, Math.max(25, Math.floor(width / 24)));
    const bloodCount = 7;
    const emberCount = Math.min(30, Math.max(16, Math.floor(width / 38)));

    for (let i = 0; i < rainCount; i++) {
      raindrops.push(new RainDrop(false));
    }
    for (let i = 0; i < bloodCount; i++) {
      raindrops.push(new RainDrop(true));
    }
    for (let i = 0; i < emberCount; i++) {
      embers.push(new Ember());
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        constellations.rebuild();
      }, 120);
    });

    function animate() {
      if (!document.hidden) {
        ctx.clearRect(0, 0, width, height);

        constellations.update();
        constellations.draw();

        for (let i = 0; i < raindrops.length; i++) {
          raindrops[i].update();
          raindrops[i].draw();
        }

        for (let i = 0; i < embers.length; i++) {
          embers[i].update();
          embers[i].draw();
        }
      }
      requestAnimationFrame(animate);
    }

    animate();
  }

  const tabPrefix = "YaFicus · ";
  const tabSuffixes = [
    "Grimoire",
    "Web & Python",
    "XVII Arcanum",
    "Blood & Obsidian"
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let isTabHidden = false;
  let titleTimeout = null;
  let hiddenInterval = null;

  const hiddenPhrases = [
    "† Вернись в Гримуар...",
    "⸸ YaFicus ждёт...",
    "✦ XVII Аркан зовёт..."
  ];

  function tickTitle() {
    if (isTabHidden) return;

    let currentSuffixes = [...tabSuffixes];
    if (bgAudio && !bgAudio.paused && playlist[currentTrackIdx]) {
      currentSuffixes.push(`▶ ${playlist[currentTrackIdx].title}`);
    }

    const currentSuffix = currentSuffixes[phraseIdx % currentSuffixes.length];

    if (!isDeleting) {
      charIdx++;
      const cursor = charIdx < currentSuffix.length ? " ⸸" : "";
      document.title = tabPrefix + currentSuffix.substring(0, charIdx) + cursor;

      if (charIdx >= currentSuffix.length) {
        document.title = tabPrefix + currentSuffix;
        isDeleting = true;
        titleTimeout = setTimeout(tickTitle, 2800);
        return;
      }
      titleTimeout = setTimeout(tickTitle, 160);
    } else {
      charIdx--;
      const cursor = charIdx > 0 ? " ⸸" : "";
      document.title = tabPrefix + currentSuffix.substring(0, charIdx) + cursor;

      if (charIdx <= 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % currentSuffixes.length;
        titleTimeout = setTimeout(tickTitle, 450);
        return;
      }
      titleTimeout = setTimeout(tickTitle, 80);
    }
  }

  titleTimeout = setTimeout(tickTitle, 1200);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isTabHidden = true;
      if (titleTimeout) clearTimeout(titleTimeout);
      let hiddenIdx = 0;
      document.title = hiddenPhrases[0];
      hiddenInterval = setInterval(() => {
        hiddenIdx = (hiddenIdx + 1) % hiddenPhrases.length;
        document.title = hiddenPhrases[hiddenIdx];
      }, 2000);
    } else {
      isTabHidden = false;
      if (hiddenInterval) clearInterval(hiddenInterval);
      document.title = "✦ С возвращением ✦";
      setTimeout(() => {
        charIdx = 0;
        isDeleting = false;
        tickTitle();
      }, 1500);
    }
  });
  function initViewCounter() {
    const countEls = document.querySelectorAll('.views-count-num');
    if (!countEls.length) return;

    const BASE_VIEWS = 13;
    let stored = parseInt(localStorage.getItem('yaficus_grimoire_views'), 10);
    if (isNaN(stored) || stored < BASE_VIEWS) {
      stored = BASE_VIEWS;
    }

    const currentViews = stored + 1;
    localStorage.setItem('yaficus_grimoire_views', currentViews);
    localStorage.setItem('yaficus_views_cache', currentViews);

    const prevViews = currentViews - 1;
    countEls.forEach(el => {
      el.textContent = prevViews.toLocaleString('ru-RU');
    });

    setTimeout(() => {
      countEls.forEach(el => {
        el.textContent = currentViews.toLocaleString('ru-RU');
        el.style.transform = 'scale(1.22)';
        el.style.color = '#ff4d5a';
        el.style.textShadow = '0 0 10px rgba(255, 77, 90, 0.7)';
        setTimeout(() => {
          el.style.transform = '';
          el.style.color = '';
          el.style.textShadow = '';
        }, 350);
      });
    }, 280);

    try {
      const ping = new Image();
      ping.src = 'https://hits.sh/yaficus.github.io/yaficus.svg?t=' + Date.now();
    } catch (_) {}

    document.querySelectorAll('.views-counter-badge').forEach(badge => {
      badge.addEventListener('click', () => {
        const current = countEls[0]?.textContent || currentViews.toLocaleString('ru-RU');
        showToast('Просмотров Гримуара: ' + current);
      });
    });
  }

  initViewCounter();
});
