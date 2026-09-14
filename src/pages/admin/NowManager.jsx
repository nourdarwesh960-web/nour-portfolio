import ResourceManager from '../../components/admin/ResourceManager.jsx';
import { portfolioApi } from '../../api/client.js';

export default function NowManager() {
  return (
    <ResourceManager
      title="Now / This month"
      api={portfolioApi.now}
      newRecord={() => ({ text: '', meta: '' })}
      renderSummary={(n) => n.text?.slice(0, 50) || 'Now item'}
      fields={[
        { key: 'text', label: 'Text', type: 'textarea', rows: 2 },
        { key: 'meta', label: 'Meta tag (e.g. wk 2/6)' },
      ]}
    />
  );
}
