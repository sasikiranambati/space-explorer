import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Sparkles, Bot, CornerDownRight } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface AIResponse {
  answer: string;
  followups: string[];
}

// 1. Detailed response catalog for suggested queries
const SUGGESTED_RESPONSES: Record<string, AIResponse> = {
  "Why is Mars red?": {
    answer: "Mars is red because its surface is covered in a thick layer of **iron oxide** (rust). Over billions of years, iron-rich minerals reacted with trace atmospheric water vapor and oxygen, spreading rusty dust across the planet.\n\n### Mars Surface Highlights:\n* **Rust Storm Dunes:** Fine particles are swept up regularly in planet-wide windstorms.\n* **Weak Atmosphere:** Consists of 95% carbon dioxide ($CO_2$), offering minimal protection from solar radiation.",
    followups: ["Did Mars ever have water?", "What are the Moons of Mars?"]
  },
  "Can humans live on Venus?": {
    answer: "No, Venus is extremely hostile and completely uninhabitable for humans.\n\n### Why Venus is Uninhabitable:\n1. **Melting Temperatures:** The runaway greenhouse effect traps solar heat, raising surface temperatures to $475^\\circ\\text{C}$ (hot enough to melt lead).\n2. **Acid Rain Clouds:** Thick atmosphere clouds consist of highly corrosive sulfuric acid.\n3. **Crushing Pressure:** Atmospheric density is 92 times greater than Earth's, equivalent to being 1 km deep underwater.",
    followups: ["Why is Venus hotter than Mercury?", "What was the Venera mission?"]
  },
  "Why is Pluto not a planet?": {
    answer: "In 2006, the IAU reclassified Pluto as a **dwarf planet** because it failed to meet the third criteria: **clearing its neighborhood** of other orbital bodies.\n\n### The Three Planetary Rules:\n1. Must orbit a star (the Sun).\n2. Must assume a spherical shape (hydrostatic equilibrium).\n3. Must clear neighboring space debris (Pluto crosses paths with Neptune and Kuiper belt objects).",
    followups: ["What did New Horizons discover on Pluto?", "How cold is Pluto?"]
  },
  "How does a black hole work?": {
    answer: "A black hole is a region of space-time where gravity is so intense that nothing—not even light—can escape. It is created when a supermassive star collapses at the end of its life cycle.\n\n### Anatomy Details:\n* **Event Horizon:** The outer limit boundary or point of no return.\n* **Singularity:** The central core point of infinite curvature and density where laws of physics break down.",
    followups: ["What is a wormhole?", "Can a black hole die?"]
  },
  "Which planet has the strongest gravity?": {
    answer: "Among the planets in our solar system, **Jupiter** has the strongest gravity by far.\n\n### Gravity Specs:\n* **Surface Gravity:** $24.79 \\text{ m/s}^2$ (approx. $2.53\\times$ Earth's gravity).\n* **Implication:** If you weigh $100 \\text{ lbs}$ on Earth, you would weigh $253 \\text{ lbs}$ on Jupiter's cloud tops.",
    followups: ["What is microgravity?", "Which planet has the weakest gravity?"]
  }
};

// 2. Secondary follow-up query replies
const SECONDARY_RESPONSES: Record<string, AIResponse> = {
  "Did Mars ever have water?": {
    answer: "Yes, billions of years ago Mars had flowing rivers, lakes, and oceans. Spacecraft cameras and rovers have mapped dry river channels, lakebeds, and sedimentary clay minerals that could only form in liquid water.",
    followups: ["What are the Moons of Mars?"]
  },
  "What are the Moons of Mars?": {
    answer: "Mars has two small, lumpy moons: **Phobos** (fear) and **Deimos** (panic). They are tiny, heavily cratered, and are widely believed to be captured asteroids from the nearby asteroid belt.",
    followups: ["Why is Mars red?"]
  },
  "Why is Venus hotter than Mercury?": {
    answer: "Venus is hotter than Mercury because of its extremely dense carbon dioxide atmosphere, which traps heat through a runaway greenhouse effect. Mercury has no atmosphere to trap heat and is cold on its nightside.",
    followups: ["What was the Venera mission?"]
  },
  "What was the Venera mission?": {
    answer: "The Soviet Union's **Venera program** landed multiple probes on Venus's surface. Due to the extreme heat and crushing pressure, the longest-lasting probe survived for only 110 minutes before failing.",
    followups: ["Can humans live on Venus?"]
  },
  "What did New Horizons discover on Pluto?": {
    answer: "NASA's **New Horizons** probe flew past Pluto in 2015, revealing a giant heart-shaped nitrogen ice glacier, active blue atmospheric hazes, water-ice mountain ranges, and floating glaciers.",
    followups: ["How cold is Pluto?"]
  },
  "How cold is Pluto?": {
    answer: "Pluto is incredibly cold, with surface temperatures averaging around $-228^\\circ\\text{C}$ ($-378^\\circ\\text{F}$), frozen enough to solidify gases like nitrogen and methane into ice.",
    followups: ["Why is Pluto not a planet?"]
  },
  "What is a wormhole?": {
    answer: "A wormhole is a theoretical passage through space-time that could create shortcuts for long journeys across the universe. While predicted by general relativity, none have ever been observed.",
    followups: ["Can a black hole die?"]
  },
  "Can a black hole die?": {
    answer: "Yes. According to Stephen Hawking, black holes slowly evaporate over colossal timescales by emitting **Hawking Radiation** at the event horizon boundary.",
    followups: ["How does a black hole work?"]
  },
  "What is microgravity?": {
    answer: "Microgravity is the condition in which people or objects appear to be weightless. It is experienced during freefall in orbit, where gravity is still active but everything falls together.",
    followups: ["Which planet has the weakest gravity?"]
  },
  "Which planet has the weakest gravity?": {
    answer: "Mercury and Mars tie for the weakest gravity in our solar system, both having a surface gravity of around $3.7 \\text{ m/s}^2$ (about 38% of Earth's gravitational pull).",
    followups: ["Which planet has the strongest gravity?"]
  }
};

// 3. Keyword parsing replies for arbitrary custom text
const KEYWORD_RESPONSES: { keywords: string[]; answer: string; followups: string[] }[] = [
  {
    keywords: ["earth", "human"],
    answer: "Earth is the third planet from the Sun and the only known astronomical body supporting life. It features liquid water oceans, a protective atmosphere, and active tectonics.",
    followups: ["Which planet has the strongest gravity?"]
  },
  {
    keywords: ["apollo", "moon", "armstrong", "landing"],
    answer: "The **Apollo program** successfully landed 12 astronauts on the Moon between 1969 and 1972, starting with Neil Armstrong and Buzz Aldrin on Apollo 11.",
    followups: ["What are the Moons of Mars?"]
  },
  {
    keywords: ["rocket", "spacex", "starship", "sls"],
    answer: "Modern heavy launch vehicles like NASA's **SLS** (Space Launch System) and SpaceX's **Starship** generate millions of pounds of thrust to carry astronauts back to deep space.",
    followups: ["What is microgravity?"]
  },
  {
    keywords: ["astronaut", "eva", "suit", "nasa"],
    answer: "Astronauts undergo extensive physical and mental training to work in space. They wear specialized **Extravehicular Activity** (EVA) spacesuits to survive vacuum pressures and severe thermal bounds.",
    followups: ["What is microgravity?"]
  },
  {
    keywords: ["sun", "star", "solar", "fusion"],
    answer: "The Sun is a yellow dwarf star that contains 99.8% of the mass in the entire solar system. Its core is powered by the nuclear fusion of hydrogen into helium.",
    followups: ["Why is Venus hotter than Mercury?"]
  }
];

export const SpaceAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeFollowups, setActiveFollowups] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const cached = localStorage.getItem('space_explorer_ai_chat');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setMessages(parsed);
      } catch (e) {
        console.warn('Failed to parse cached chat logs:', e);
      }
    } else {
      // Intro greeting
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          text: "Greetings, voyager! I am **Orion**, your AI cosmic assistant. Ask me anything about planetary telemetry, space missions, spacesuits, or the laws of astrophysics!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, []);

  // Save chat history on update
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('space_explorer_ai_chat', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Basic regex markdown parser
  const renderMarkdown = (text: string) => {
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Parse lists
    const lines = html.split('\n');
    let inList = false;
    const processedLines = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const content = trimmed.substring(2);
        let listLine = `<li>${content}</li>`;
        if (!inList) {
          inList = true;
          listLine = `<ul style="margin: 6px 0; padding-left: 20px; list-style-type: disc;">` + listLine;
        }
        return listLine;
      } else {
        if (inList) {
          inList = false;
          return `</ul>` + line;
        }
        return line;
      }
    });
    if (inList) {
      processedLines.push('</ul>');
    }
    html = processedLines.join('\n');

    // Parse headers
    html = html.replace(/### (.*?)\n/g, '<h4 style="margin: 12px 0 6px 0; color: var(--color-accent); font-weight: 700;">$1</h4>');
    
    // Paragraph spaces
    html = html.split('\n\n').map(p => {
      if (p.trim().startsWith('<ul') || p.trim().startsWith('<h4') || p.trim().startsWith('</ul')) {
        return p;
      }
      return `<p style="margin: 6px 0; line-height: 1.5;">${p}</p>`;
    }).join('');

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  // Submit response handler
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    setActiveFollowups([]);

    // Simulate AI thinking and typing delay
    setTimeout(() => {
      let responseText = '';
      let followupsList: string[] = [];

      const queryNormalized = text.trim();

      // 1. Direct suggested questions checks
      if (SUGGESTED_RESPONSES[queryNormalized]) {
        responseText = SUGGESTED_RESPONSES[queryNormalized].answer;
        followupsList = SUGGESTED_RESPONSES[queryNormalized].followups;
      }
      // 2. Secondary follow-up checks
      else if (SECONDARY_RESPONSES[queryNormalized]) {
        responseText = SECONDARY_RESPONSES[queryNormalized].answer;
        followupsList = SECONDARY_RESPONSES[queryNormalized].followups;
      }
      // 3. Custom keywords search
      else {
        const queryLower = queryNormalized.toLowerCase();
        const matched = KEYWORD_RESPONSES.find(res =>
          res.keywords.some(keyword => queryLower.includes(keyword))
        );

        if (matched) {
          responseText = matched.answer;
          followupsList = matched.followups;
        } else {
          responseText = "I am **Orion**, your cosmic assistant! I specialize in planetary orbits, spacesuits, rocket telemetry, and black hole physics. Try asking one of the suggested questions below, or inquire about Mars, Venus, gravity, rockets, or astronauts!";
          followupsList = Object.keys(SUGGESTED_RESPONSES);
        }
      }

      const aiMsg: Message = {
        id: Math.random().toString(),
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      setActiveFollowups(followupsList);
    }, 1200);
  };

  const handleClearChat = () => {
    localStorage.removeItem('space_explorer_ai_chat');
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: "Greetings, voyager! I am **Orion**, your AI cosmic assistant. Ask me anything about planetary telemetry, space missions, spacesuits, or the laws of astrophysics!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setActiveFollowups([]);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(10, 15, 30, 0.75)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${isOpen ? 'var(--color-accent)' : 'rgba(56, 189, 248, 0.4)'}`,
          boxShadow: '0 0 20px rgba(56, 189, 248, 0.25)',
          color: 'var(--color-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1000,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.boxShadow = '0 0 30px rgba(56, 189, 248, 0.45)';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.boxShadow = '0 0 20px rgba(56, 189, 248, 0.25)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Glassmorphic Chat Drawer */}
      {isOpen && (
        <GlassCard
          style={{
            position: 'fixed',
            bottom: '92px',
            right: '24px',
            width: '380px',
            height: '520px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: 'rgba(10, 15, 30, 0.88)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
            borderRadius: '20px'
          }}
        >
          {/* Chat Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                <Bot size={16} style={{ color: 'var(--color-accent)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Orion <Sparkles size={11} style={{ color: 'var(--color-accent)' }} />
                </h3>
                <span style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} /> Online Telemetry
                </span>
              </div>
            </div>
            
            <button
              onClick={handleClearChat}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.7rem', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Reset logs
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div style={{ flexGrow: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }} className="chat-scrollbar">
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <div
                  style={{
                    background: msg.sender === 'user' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    border: msg.sender === 'user' ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                    padding: '12px 14px',
                    borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    lineHeight: '1.4'
                  }}
                >
                  {renderMarkdown(msg.text)}
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Simulated Typing Anim */}
            {isTyping && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '85%', alignSelf: 'flex-start' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '12px 16px', borderRadius: '16px 16px 16px 2px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <span className="dot-typing" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-accent)' }} />
                  <span className="dot-typing" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-accent)', animationDelay: '0.2s' }} />
                  <span className="dot-typing" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-accent)', animationDelay: '0.4s' }} />
                </div>
              </div>
            )}

            {/* Dynamic follow-up chips list (shown only after typing finishes) */}
            {!isTyping && activeFollowups.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CornerDownRight size={10} style={{ color: 'var(--color-accent)' }} /> Follow-up suggested telemetry:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {activeFollowups.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      style={{
                        background: 'rgba(56, 189, 248, 0.08)',
                        border: '1px solid rgba(56, 189, 248, 0.25)',
                        borderRadius: '12px',
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        color: 'var(--color-accent)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(56, 189, 248, 0.15)')}
                      onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)')}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Prompts list (shown only at start when list is just the intro greeting) */}
          {messages.length === 1 && !isTyping && (
            <div style={{ padding: '0 20px 12px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>SUGGESTED QUESTIONS:</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {Object.keys(SUGGESTED_RESPONSES).map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all var(--transition-fast)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(56, 189, 248, 0.05)';
                      e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                      e.currentTarget.style.color = 'var(--color-accent)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer Area */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
              placeholder="Ask Orion a space question..."
              style={{
                flexGrow: 1,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '10px 14px',
                color: 'white',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'var(--color-accent)',
                border: 'none',
                color: 'var(--bg-deep)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              onMouseOver={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')}
              onMouseOut={(e) => (e.currentTarget.style.filter = 'none')}
            >
              <Send size={16} />
            </button>
          </div>
        </GlassCard>
      )}

      {/* Typing dots keyframe animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .dot-typing {
          animation: pulse-dot 1.2s infinite ease-in-out;
        }
        .chat-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .chat-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(56, 189, 248, 0.3);
        }
      `}} />
    </>
  );
};
export default SpaceAssistant;
