export interface INFT {
    id: string;
    name: string;
    description: string;
    image_url: string;
    public_metadata_uri?: string;
    private_metadata_uri?: string;
    evolution_stage: number;
    interaction_count: number;
    atoma_model_id: string;
    content?: {
      fields?: {
        owner?: string;
        creator?: string;
      };
    };
    isFavorite?: boolean;
  }
  
  export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  }
  
  export interface Transaction {
    digest: string;
    data: {
      timestampMs?: number;
      effects?: {
        gasUsed?: {
          computationCost?: number;
          storageCost?: number;
          storageRebate?: number;
        };
      };
    };
    type?: string;
  }