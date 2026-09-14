import ResourceManager from '../../components/admin/ResourceManager.jsx';
import { portfolioApi } from '../../api/client.js';

export default function ExperienceManager() {
  return (
    <ResourceManager
      title="Experience"
      api={portfolioApi.experience}
      newRecord={() => ({ role: '', company: '', location: '', year: '' })}
      renderSummary={(x) => `${x.role || 'Role'} @ ${x.company || 'Company'}`}
      fields={[
        { key: 'role', label: 'Role' },
        { key: 'company', label: 'Company' },
        { key: 'location', label: 'Location' },
        { key: 'year', label: 'Year range' },
      ]}
    />
  );
}
