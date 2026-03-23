const url = process.env.VITE_SUPABASE_URL || 'https://scxuetvbzymvnvecqyyd.supabase.co';
const key = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjeHVldHZienltdm52ZWNxeXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyOTQyMjAsImV4cCI6MjA4Njg3MDIyMH0.uJfxMowLQegGyuMVykK25oOH9-kvRnjG7qvQqfQxHCo';

const mockData = [
  {
      title: "Sustainable Biodegradable Polymers for Packaging",
      principal_investigator: "Prof. Neha Gupta",
      funding_amount: 800000,
      status: "approved",
      objectives: ["Sustainability", "Materials Science", "Green Tech"],
      abstract: "Creating cost-effective, rapidly biodegradable polymers from agricultural waste to replace single-use plastics. The project has already secured initial funding and is looking for waitlist members.",
      co_investigators: ["Dr. Alan Smith", "Dr. Bob Vance"],
      methodology: "We synthesize the material from sugarcane bagasse and test degradation in varying environments."
  },
  {
      title: "AI-Driven Crop Yield Prediction Models",
      principal_investigator: "Dr. Vikram Singh",
      funding_amount: 1250000,
      status: "proposal",
      objectives: ["Artificial Intelligence", "Agriculture", "Predictive Modeling"],
      abstract: "Utilizing satellite imagery and terrestrial sensor data to train deep learning models that predict crop yields months in advance. Seeking partners to provide initial datasets.",
      co_investigators: ["Alice Wang"],
      methodology: "CNN models applied on multispectral satellite data over a 5-year period."
  },
  {
      title: "Next-Gen Solid State Batteries for EVs",
      principal_investigator: "Prof. Rakesh Kumar",
      funding_amount: 2500000,
      status: "proposal",
      objectives: ["EV", "Energy Storage", "Hardware"],
      abstract: "Researching solid electrolytes that offer higher energy density and superior safety compared to traditional Li-ion batteries.",
      co_investigators: ["Dr. X", "Researcher Y", "Postdoc Z"],
      methodology: "Using ceramic-based electrolytes and testing under high pressure/temperature conditions."
  }
];

async function seed() {
    for (const project of mockData) {
        const response = await fetch(`${url}/rest/v1/research_projects`, {
            method: 'POST',
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                title: project.title,
                principal_investigator: project.principal_investigator,
                funding_amount: project.funding_amount,
                status: project.status,
                objectives: project.objectives,
                abstract: project.abstract,
                co_investigators: project.co_investigators,
                methodology: project.methodology
            })
        });
        if (!response.ok) {
            console.error('Failed to insert', project.title, await response.text());
        } else {
            console.log('Inserted', project.title);
        }
    }
}

seed();
