import * as Icons from './Icons';
import { useUIStore } from '../stores';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  prompt: string;
}

const templates: Template[] = [
  {
    id: 'landing-page',
    name: 'Landing Page',
    description: 'Create a modern SaaS landing page',
    icon: 'Layout',
    prompt: 'Create a modern, responsive landing page for a SaaS product using React and Tailwind CSS. Include: hero section with headline and CTA, features grid, pricing section, and footer. Use a clean, professional design with smooth animations.'
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Build an analytics dashboard',
    icon: 'LayoutGrid',
    prompt: 'Create a responsive analytics dashboard using React and Tailwind CSS. Include: sidebar navigation, header with user profile, stat cards with metrics, a chart area (use placeholder), and recent activity list. Make it look professional and data-focused.'
  },
  {
    id: 'form',
    name: 'Contact Form',
    description: 'Design a contact form',
    icon: 'PenTool',
    prompt: 'Create a polished contact form component using React and Tailwind CSS. Include fields for name, email, subject, and message. Add validation states, a submit button, and proper styling. Make it responsive and accessible.'
  },
  {
    id: 'card',
    name: 'Card Component',
    description: 'Design a reusable card',
    icon: 'Layout',
    prompt: 'Create a versatile card component using React and Tailwind CSS. It should support an image, title, description, and action buttons. Include hover effects and make it reusable with props for customization.'
  },
  {
    id: 'button',
    name: 'Button Variants',
    description: 'Button component with variants',
    icon: 'Zap',
    prompt: 'Create a flexible button component using React and Tailwind CSS. Support multiple variants (primary, secondary, ghost, danger), sizes (sm, md, lg), and states (default, loading, disabled). Include proper hover and focus styles.'
  }
];

export default function TemplatesModal() {
  const { isTemplatesModalOpen, setTemplatesModalOpen } = useUIStore();

  if (!isTemplatesModalOpen) return null;

  const handleSelectTemplate = (template: Template) => {
    setTemplatesModalOpen(false);
    window.dispatchEvent(new CustomEvent('use-template', { detail: template.prompt }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setTemplatesModalOpen(false)}
      />
      <div className="relative bg-surface border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-primary">Templates</h2>
            <p className="text-sm text-secondary">Quick start with pre-built prompts</p>
          </div>
          <button
            onClick={() => setTemplatesModalOpen(false)}
            className="p-2 text-secondary hover:text-primary hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Close"
          >
            <Icons.ChevronDown size={20} className="rotate-90" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className="flex items-start gap-3 p-4 bg-zinc-900/50 hover:bg-zinc-800 border border-border hover:border-zinc-700 rounded-lg text-left transition-all group"
              >
                <div className="p-2 bg-zinc-800 rounded-lg text-secondary group-hover:text-primary transition-colors">
                  {template.icon === 'Layout' && <Icons.Layout size={20} />}
                  {template.icon === 'LayoutGrid' && <Icons.LayoutGrid size={20} />}
                  {template.icon === 'PenTool' && <Icons.PenTool size={20} />}
                  {template.icon === 'Zap' && <Icons.Zap size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-primary group-hover:text-white transition-colors">{template.name}</h3>
                  <p className="text-sm text-secondary mt-0.5">{template.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-3 border-t border-border bg-zinc-900/30">
          <p className="text-xs text-secondary text-center">
            More templates coming soon. Custom prompts can be saved in version history.
          </p>
        </div>
      </div>
    </div>
  );
}

export { templates };
