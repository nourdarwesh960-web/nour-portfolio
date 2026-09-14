import ResourceManager from '../../components/admin/ResourceManager.jsx';
import { portfolioApi } from '../../api/client.js';

export default function TickerManager() {
  return (
    <ResourceManager
      title="Masthead ticker"
      api={portfolioApi.ticker}
      newRecord={() => ({ text: '', style: 'default', sup: '' })}
      renderSummary={(t) => t.text || 'Ticker item'}
      fields={[
        { key: 'text', label: 'Text' },
        {
          key: 'style',
          label: 'Style (default / serif / outline / accent)',
          placeholder: 'default',
        },
        { key: 'sup', label: 'Superscript (e.g. /01, → EST 2022)' },
      ]}
    />
  );
}
