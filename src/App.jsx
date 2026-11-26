import { useState } from 'react'
import Button from './components/Button.jsx'
import Icon from './components/Icon.jsx'
import Modal from './components/Modal.jsx'
import TextInput from './components/TextInput.jsx'
import './App.css'

const STORAGE_KEY = 'linkdrop-links'

function isSavedLink(value) {
  if (
    !value ||
    typeof value.id !== 'string' ||
    typeof value.title !== 'string' ||
    typeof value.url !== 'string' ||
    typeof value.favorite !== 'boolean' ||
    !Number.isFinite(value.createdAt)
  ) {
    return false
  }

  try {
    return ['http:', 'https:'].includes(new URL(value.url).protocol)
  } catch {
    return false
  }
}

function getInitialLinks() {
  try {
    const savedLinks = localStorage.getItem(STORAGE_KEY)
    if (!savedLinks) return { links: [], error: '' }

    const parsedLinks = JSON.parse(savedLinks)
    if (!Array.isArray(parsedLinks)) {
      throw new TypeError('Saved links must be a list.')
    }

    const links = parsedLinks.filter(isSavedLink)
    const error =
      links.length === parsedLinks.length
        ? ''
        : 'Some saved links could not be restored.'
    return { links, error }
  } catch (error) {
    console.error('Unable to load LinkDrop links from local storage.', error)
    return {
      links: [],
      error: 'Saved links could not be loaded. New links may not persist.',
    }
  }
}

function getLinkDetails(url) {
  const hostname = new URL(url).hostname.replace(/^www\./, '')

  return {
    hostname,
    monogram: hostname.charAt(0).toUpperCase(),
  }
}

function formatSavedDate(timestamp) {
  const minutesSinceSaved = Math.floor((Date.now() - timestamp) / 60000)

  if (minutesSinceSaved < 1) return 'Saved just now'
  if (minutesSinceSaved < 60) return `Saved ${minutesSinceSaved}m ago`
  if (minutesSinceSaved < 1440) {
    return `Saved ${Math.floor(minutesSinceSaved / 60)}h ago`
  }

  return `Saved ${new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })}`
}

function normalizeUrl(value) {
  const trimmedUrl = value.trim()
  const urlWithProtocol = /^[a-z][a-z\d+.-]*:/i.test(trimmedUrl)
    ? trimmedUrl
    : `https://${trimmedUrl}`
  const parsedUrl = new URL(urlWithProtocol)

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    throw new TypeError('Enter an http or https address.')
  }

  return parsedUrl.href
}

function EmptyState({ isFavoritesView, onAddLink, onShowAll }) {
  return (
    <section className="empty-state" aria-live="polite">
      <div className="empty-state__art" aria-hidden="true">
        <Icon name={isFavoritesView ? 'star' : 'inbox'} size={25} />
      </div>
      <h2>{isFavoritesView ? 'No favorites yet' : 'Your link list is empty'}</h2>
      <p>
        {isFavoritesView
          ? 'Mark a saved link as a favorite and it will be waiting here.'
          : 'Keep the good stuff close. Add a link and find it here whenever you need it.'}
      </p>
      {isFavoritesView ? (
        <Button variant="secondary" onClick={onShowAll}>
          Browse all links
        </Button>
      ) : (
        <Button onClick={onAddLink}>
          <Icon name="plus" size={17} />
          Save your first link
        </Button>
      )}
    </section>
  )
}

function LinkCard({ link, onToggleFavorite, onDelete }) {
  const { hostname, monogram } = getLinkDetails(link.url)

  return (
    <article className="link-card">
      <div className="link-card__monogram" aria-hidden="true">
        {monogram}
      </div>
      <div className="link-card__content">
        <div className="link-card__meta">
          <span className="link-card__domain">{hostname}</span>
          <span className="link-card__separator" aria-hidden="true">
            ·
          </span>
          <span>{formatSavedDate(link.createdAt)}</span>
        </div>
        <a
          className="link-card__title"
          href={link.url}
          target="_blank"
          rel="noreferrer"
        >
          {link.title}
          <Icon name="arrow-up-right" size={15} />
        </a>
        <p className="link-card__url">{link.url}</p>
      </div>
      <div className="link-card__actions">
        <Button
          variant="icon"
          className={link.favorite ? 'is-favorite' : ''}
          aria-label={
            link.favorite ? 'Remove from favorites' : 'Add to favorites'
          }
          aria-pressed={link.favorite}
          onClick={() => onToggleFavorite(link.id)}
        >
          <Icon name="star" size={17} />
        </Button>
        <Button
          variant="icon"
          className="link-card__delete"
          aria-label={`Delete ${link.title}`}
          onClick={() => onDelete(link.id)}
        >
          <Icon name="trash" size={17} />
        </Button>
      </div>
    </article>
  )
}

function App() {
  const [initialState] = useState(getInitialLinks)
  const [links, setLinks] = useState(initialState.links)
  const [storageError, setStorageError] = useState(initialState.error)
  const [activeView, setActiveView] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [urlError, setUrlError] = useState('')

  const favorites = links.filter((link) => link.favorite)
  const visibleLinks = activeView === 'favorites' ? favorites : links

  function saveLinks(nextLinks) {
    setLinks(nextLinks)

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextLinks))
      setStorageError('')
    } catch (error) {
      console.error('Unable to save LinkDrop links to local storage.', error)
      setStorageError('Your changes could not be saved on this device.')
    }
  }

  function closeModal() {
    setIsModalOpen(false)
    setTitle('')
    setUrl('')
    setUrlError('')
  }

  function openAddLinkModal() {
    setTitle('')
    setUrl('')
    setUrlError('')
    setIsModalOpen(true)
  }

  function handleAddLink(event) {
    event.preventDefault()

    let normalizedUrl
    try {
      normalizedUrl = normalizeUrl(url)
    } catch {
      setUrlError('Enter a valid website address.')
      return
    }

    const parsedUrl = new URL(normalizedUrl)
    const linkTitle = title.trim() || parsedUrl.hostname.replace(/^www\./, '')
    const nextLinks = [
      {
        id: crypto.randomUUID(),
        url: normalizedUrl,
        title: linkTitle,
        favorite: false,
        createdAt: Date.now(),
      },
      ...links,
    ]

    saveLinks(nextLinks)
    setActiveView('all')
    closeModal()
  }

  function handleToggleFavorite(id) {
    saveLinks(
      links.map((link) =>
        link.id === id ? { ...link, favorite: !link.favorite } : link,
      ),
    )
  }

  function handleDeleteLink(id) {
    saveLinks(links.filter((link) => link.id !== id))
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand" aria-label="LinkDrop">
          <span className="brand__mark" aria-hidden="true">
            <Icon name="link" size={21} />
          </span>
          <span className="brand__copy">
            <span className="brand__name">LinkDrop</span>
            <span className="brand__tagline">A home for your good finds</span>
          </span>
        </div>
        <Button className="header-add" onClick={openAddLinkModal}>
          <Icon name="plus" size={17} />
          <span>Add link</span>
        </Button>
      </header>

      <main className="main-content">
        <section className="collection-heading">
          <div>
            <p className="eyebrow">YOUR COLLECTION</p>
            <h1>Your links</h1>
          </div>
          <span className="link-count">
            {links.length} {links.length === 1 ? 'link' : 'links'}
          </span>
        </section>

        <nav className="view-navigation" aria-label="Link views">
          <button
            type="button"
            className={`view-navigation__item ${
              activeView === 'all' ? 'is-active' : ''
            }`}
            aria-pressed={activeView === 'all'}
            onClick={() => setActiveView('all')}
          >
            All links
            <span>{links.length}</span>
          </button>
          <button
            type="button"
            className={`view-navigation__item ${
              activeView === 'favorites' ? 'is-active' : ''
            }`}
            aria-pressed={activeView === 'favorites'}
            onClick={() => setActiveView('favorites')}
          >
            <Icon name="star" size={15} />
            Favorites
            <span>{favorites.length}</span>
          </button>
        </nav>

        {storageError && (
          <p className="storage-message" role="alert">
            {storageError}
          </p>
        )}

        <section className="links-section" aria-label="Saved links">
          {visibleLinks.length > 0 ? (
            <>
              <div className="list-heading">
                <h2>
                  {activeView === 'favorites'
                    ? 'Your favorites'
                    : 'Recently saved'}
                </h2>
                <span>Newest first</span>
              </div>
              <div className="link-list">
                {visibleLinks.map((link) => (
                  <LinkCard
                    key={link.id}
                    link={link}
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={handleDeleteLink}
                  />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              isFavoritesView={activeView === 'favorites'}
              onAddLink={openAddLinkModal}
              onShowAll={() => setActiveView('all')}
            />
          )}
        </section>
      </main>

      <footer className="app-footer">
        <span className="footer-dot" aria-hidden="true" />
        Your bookmarks, minus the clutter.
      </footer>

      {isModalOpen && (
        <Modal title="Save a link" onClose={closeModal}>
          <p className="modal-description">
            Drop in a URL and we’ll keep it handy for later.
          </p>
          <form className="link-form" onSubmit={handleAddLink}>
            <TextInput
              id="link-url"
              label="Website URL"
              type="text"
              inputMode="url"
              placeholder="https://example.com/article"
              value={url}
              onChange={(event) => {
                setUrl(event.target.value)
                if (urlError) setUrlError('')
              }}
              error={urlError}
              autoFocus
              required
            />
            <TextInput
              id="link-title"
              label="Name it (optional)"
              placeholder="A useful article"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <div className="modal-actions">
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">
                <Icon name="bookmark" size={16} />
                Save link
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default App
