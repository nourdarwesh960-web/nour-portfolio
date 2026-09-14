import ResourceManager from '../../components/admin/ResourceManager.jsx';
import { portfolioApi } from '../../api/client.js';

export default function StackManager() {
  return (
    <ResourceManager
      title="Stack"
      api={portfolioApi.stack}
      newRecord={() => ({ title: '', italicPart: '', description: '', tags: [] })}
      renderSummary={(s) => [s.title, s.italicPart].filter(Boolean).join(' ') || 'Stack item'}
      fields={[
        { key: 'title', label: 'Title' },
        { key: 'italicPart', label: 'Italic subtitle' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'tags', label: 'Tags', type: 'tags' },
      ]}
    />
  );
}
