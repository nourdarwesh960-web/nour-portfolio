import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { portfolioApi } from '../../api/client.js';
import ConfirmButton from './ConfirmButton.jsx';

export default function PhotoUploader({ currentUrl, onChange }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be under 10 MB');
      return;
    }
    setBusy(true);
    try {
      const { url } = await portfolioApi.uploads.profilePhoto(file);
      onChange(url);
      toast.success('Photo uploaded');
    } catch (err) {
      toast.error(err.friendlyMessage || 'Upload failed');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function remove() {
    setBusy(true);
    try {
      await portfolioApi.uploads.removeProfilePhoto();
      onChange('');
      toast.success('Photo removed');
    } catch (err) {
      toast.error(err.friendlyMessage || 'Remove failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="photo-uploader">
      <div className="photo-preview">
        {currentUrl ? (
          <img src={currentUrl} alt="Profile" />
        ) : (
          <div className="photo-placeholder">No photo</div>
        )}
      </div>
      <div className="photo-actions">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          hidden
          onChange={handleFile}
        />
        <button
          type="button"
          className="btn primary"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          {busy ? 'Uploading…' : currentUrl ? 'Replace photo' : 'Upload photo'}
        </button>
        {currentUrl ? <ConfirmButton onConfirm={remove}>Remove</ConfirmButton> : null}
        <div className="photo-hint">JPEG, PNG, WEBP, or GIF — up to 10 MB.</div>
      </div>
    </div>
  );
}
