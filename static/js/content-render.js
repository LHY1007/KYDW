const DATA_SOURCES = {
  members: 'data/members.json',
  activities: 'data/activities.json',
  publications: 'data/publications.json',
  highlights: 'data/highlights.json',
  news: 'data/news.json'
};

const MEMBER_GROUP_LABEL = {
  current_leaders: 'Current Leaders',
  previous_leaders: 'Previous Leaders',
  members: 'Other Members'
};

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }
  return response.json();
}

function initNavbarCollapse() {
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navLinks = document.querySelectorAll('#navbarResponsive .nav-link');
  if (!navbarToggler) {
    return;
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.getComputedStyle(navbarToggler).display !== 'none') {
        navbarToggler.click();
      }
    });
  });
}

function renderMembers(members, keyword = '') {
  const groupsContainer = document.getElementById('member-groups');
  const countBadge = document.getElementById('member-count-badge');
  if (!groupsContainer || !countBadge) {
    return;
  }

  const normalizedKeyword = keyword.trim().toLowerCase();
  const filtered = members.filter((m) => {
    const joined = [m.name, m.role, m.affiliation, m.period].join(' ').toLowerCase();
    return !normalizedKeyword || joined.includes(normalizedKeyword);
  });

  countBadge.textContent = `${filtered.length} members`;

  const byGroup = filtered.reduce((acc, member) => {
    const group = member.group || 'members';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(member);
    return acc;
  }, {});

  const groupOrder = ['current_leaders', 'previous_leaders', 'members'];

  groupsContainer.innerHTML = groupOrder
    .filter((group) => byGroup[group] && byGroup[group].length > 0)
    .map((group) => `
      <div class="mb-4">
        <h5 class="mb-3">${MEMBER_GROUP_LABEL[group] || 'Members'}</h5>
        <div class="row g-3">
          ${byGroup[group].map((member) => `
            <div class="col-12 col-sm-6 col-lg-4">
              <article class="entity-card h-100 p-3">
                <div class="d-flex align-items-center gap-3">
                  <img src="${escapeHtml(member.avatar || 'static/assets/img/photo.png')}" alt="${escapeHtml(member.name)}" class="member-avatar" />
                  <div>
                    <h6 class="mb-1">${escapeHtml(member.name)}</h6>
                    <div class="small text-muted">${escapeHtml(member.role || '')}</div>
                  </div>
                </div>
                <p class="small mt-3 mb-1"><strong>Period:</strong> ${escapeHtml(member.period || '-')}</p>
                <p class="small mb-0"><strong>Affiliation:</strong> ${escapeHtml(member.affiliation || '-')}</p>
                ${member.profile_url ? `<a class="btn btn-sm btn-outline-primary mt-3" href="${escapeHtml(member.profile_url)}" target="_blank" rel="noreferrer">View List</a>` : ''}
              </article>
            </div>
          `).join('')}
        </div>
      </div>
    `)
    .join('');

  if (!groupsContainer.innerHTML.trim()) {
    groupsContainer.innerHTML = '<p class="text-muted">No members found for this keyword.</p>';
  }
}

function renderActivities(activities) {
  const container = document.getElementById('activity-list');
  if (!container) {
    return;
  }

  container.innerHTML = activities.map((item) => `
    <div class="col-12 col-md-6">
      <article class="entity-card h-100 p-3">
        <div class="d-flex justify-content-between align-items-start gap-2">
          <h5 class="mb-2">${escapeHtml(item.title)}</h5>
          <span class="badge text-bg-primary">${escapeHtml(item.period)}</span>
        </div>
        <p class="mb-2">${escapeHtml(item.description)}</p>
        <p class="small text-muted mb-3">${escapeHtml(item.requirements)}</p>
        <a href="${escapeHtml(item.link || '#')}" class="btn btn-sm btn-outline-primary">Learn more</a>
      </article>
    </div>
  `).join('');
}

function renderPublications(publications) {
  const container = document.getElementById('publication-list');
  if (!container) {
    return;
  }

  const sorted = [...publications].sort((a, b) => (b.year || 0) - (a.year || 0));

  container.innerHTML = sorted.map((paper) => `
    <article class="entity-card p-3">
      <div class="d-flex justify-content-between align-items-start gap-2">
        <h6 class="mb-1">${escapeHtml(paper.title)}</h6>
        <span class="badge text-bg-light border">${escapeHtml(String(paper.year || 'N/A'))}</span>
      </div>
      <div class="small text-muted mb-2">${escapeHtml(paper.venue || '')} · ${escapeHtml(paper.type || '')}</div>
      <p class="mb-2">${escapeHtml(paper.summary || '')}</p>
      <div class="d-flex flex-wrap gap-2">
        ${(paper.tags || []).map((tag) => `<span class="badge rounded-pill text-bg-secondary">${escapeHtml(tag)}</span>`).join('')}
      </div>
    </article>
  `).join('');
}

function renderHighlights(highlights) {
  const container = document.getElementById('highlight-list');
  if (!container) {
    return;
  }

  container.innerHTML = highlights
    .map((item) => `<li class="list-group-item">${escapeHtml(item)}</li>`)
    .join('');
}

function renderNews(news) {
  const container = document.getElementById('news-list');
  if (!container) {
    return;
  }

  const sorted = [...news].sort((a, b) => new Date(b.date) - new Date(a.date));
  container.innerHTML = sorted.map((item) => `
    <article class="timeline-item mb-3 p-3">
      <div class="small text-muted">${escapeHtml(item.date)}</div>
      <h6 class="mb-1">${escapeHtml(item.title)}</h6>
      <p class="mb-0">${escapeHtml(item.content)}</p>
    </article>
  `).join('');
}

function showLoadError(error) {
  console.error(error);
  const targets = ['member-groups', 'activity-list', 'publication-list', 'highlight-list', 'news-list'];
  targets.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.innerHTML = '<p class="text-danger">Failed to load content data. Please check JSON files.</p>';
    }
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  initNavbarCollapse();

  try {
    const [members, activities, publications, highlights, news] = await Promise.all([
      fetchJson(DATA_SOURCES.members),
      fetchJson(DATA_SOURCES.activities),
      fetchJson(DATA_SOURCES.publications),
      fetchJson(DATA_SOURCES.highlights),
      fetchJson(DATA_SOURCES.news)
    ]);

    renderMembers(members);
    renderActivities(activities);
    renderPublications(publications);
    renderHighlights(highlights);
    renderNews(news);

    const searchInput = document.getElementById('member-search');
    if (searchInput) {
      searchInput.addEventListener('input', (event) => {
        renderMembers(members, event.target.value || '');
      });
    }
  } catch (error) {
    showLoadError(error);
  }
});
