import ResourceManager from '../../components/admin/ResourceManager.jsx';
import { portfolioApi } from '../../api/client.js';

export default function ProjectsManager() {
  return (
    <ResourceManager
      title="Projects"
      api={portfolioApi.projects}
      newRecord={() => ({
        title: '',
        italicPart: '',
        description: '',
        tech: '',
        year: '',
        href: '',
        featured: true,
      })}
      renderSummary={(p) => [p.title, p.italicPart].filter(Boolean).join(' ') || 'Untitled project'}
      fields={[
        { key: 'title', label: 'Title' },
        { key: 'italicPart', label: 'Italic subtitle' },
        { key: 'tech', label: 'Tech stack' },
        { key: 'year', label: 'Year' },
        { key: 'href', label: 'Link URL' },
        { key: 'description', label: 'Description', type: 'textarea' },
      ]}
    />
  );
}
