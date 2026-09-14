import ResourceManager from '../../components/admin/ResourceManager.jsx';
import { portfolioApi } from '../../api/client.js';

export default function TestimonialsManager() {
  return (
    <ResourceManager
      title="Testimonials"
      api={portfolioApi.testimonials}
      newRecord={() => ({ quote: '', name: '', role: '', initials: '' })}
      renderSummary={(t) => t.name || 'Testimonial'}
      fields={[
        { key: 'name', label: 'Name' },
        { key: 'role', label: 'Role / company' },
        { key: 'initials', label: 'Initials (e.g. MR)' },
        { key: 'quote', label: 'Quote', type: 'textarea', rows: 4 },
      ]}
    />
  );
}
