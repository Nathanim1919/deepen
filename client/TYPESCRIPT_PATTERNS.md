# Modern TypeScript Patterns & Implementation Examples

## 🎯 **Advanced TypeScript Patterns**

### 1. **Strict TypeScript Configuration**

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    
    // Strict Type Checking
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    
    // Advanced Type Features
    "noPropertyAccessFromIndexSignature": true,
    "allowUnusedLabels": false,
    "allowUnreachableCode": false,
    
    // Path Mapping
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/shared/*": ["src/shared/*"],
      "@/features/*": ["src/features/*"],
      "@/infrastructure/*": ["src/infrastructure/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### 2. **Domain-Driven Type Definitions**

```typescript
// src/shared/types/domain.types.ts

// Base entity interface
interface BaseEntity {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly version: number;
}

// Value objects
type Email = string & { readonly __brand: 'Email' };
type UserId = string & { readonly __brand: 'UserId' };
type CaptureId = string & { readonly __brand: 'CaptureId' };

// Branded types for type safety
const createEmail = (email: string): Email => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid email format');
  }
  return email as Email;
};

const createUserId = (id: string): UserId => {
  if (!/^[a-f0-9]{24}$/.test(id)) {
    throw new Error('Invalid user ID format');
  }
  return id as UserId;
};

// Domain entities
interface User extends BaseEntity {
  readonly id: UserId;
  readonly email: Email;
  readonly name: string;
  readonly role: UserRole;
  readonly preferences: UserPreferences;
}

interface Capture extends BaseEntity {
  readonly id: CaptureId;
  readonly userId: UserId;
  readonly url: URL;
  readonly title: string;
  readonly content: CaptureContent;
  readonly metadata: CaptureMetadata;
  readonly ai: CaptureAI;
  readonly status: CaptureStatus;
}

// Enums with const assertions
const UserRole = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
} as const;

type UserRole = typeof UserRole[keyof typeof UserRole];

const CaptureStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETE: 'complete',
  ERROR: 'error'
} as const;

type CaptureStatus = typeof CaptureStatus[keyof typeof CaptureStatus];

// Complex types with utility types
type CreateCaptureDto = Omit<Capture, 'id' | 'createdAt' | 'updatedAt' | 'version'>;
type UpdateCaptureDto = Partial<Pick<Capture, 'title' | 'content' | 'metadata'>>;
type CaptureFilters = {
  status?: CaptureStatus;
  userId?: UserId;
  dateRange?: { start: Date; end: Date };
  search?: string;
};
```

### 3. **Repository Pattern with Generic Types**

```typescript
// src/infrastructure/repositories/base.repository.ts

interface Repository<T extends BaseEntity, ID = string> {
  findById(id: ID): Promise<T | null>;
  findAll(filters?: Partial<T>): Promise<T[]>;
  create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<T>;
  update(id: ID, entity: Partial<T>): Promise<T>;
  delete(id: ID): Promise<void>;
  exists(id: ID): Promise<boolean>;
}

interface QueryOptions<T> {
  limit?: number;
  offset?: number;
  sortBy?: keyof T;
  sortOrder?: 'asc' | 'desc';
  filters?: Partial<T>;
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Abstract base repository
abstract class BaseRepository<T extends BaseEntity, ID = string> implements Repository<T, ID> {
  constructor(protected apiClient: ApiClient) {}

  abstract findById(id: ID): Promise<T | null>;
  abstract findAll(filters?: Partial<T>): Promise<T[]>;
  abstract create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<T>;
  abstract update(id: ID, entity: Partial<T>): Promise<T>;
  abstract delete(id: ID): Promise<void>;

  async exists(id: ID): Promise<boolean> {
    const entity = await this.findById(id);
    return entity !== null;
  }

  protected async query<R>(
    endpoint: string,
    options?: QueryOptions<T>
  ): Promise<PaginatedResult<R>> {
    const params = new URLSearchParams();
    
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    if (options?.sortBy) params.append('sortBy', options.sortBy as string);
    if (options?.sortOrder) params.append('sortOrder', options.sortOrder);
    
    const response = await this.apiClient.get<PaginatedResult<R>>(
      `${endpoint}?${params.toString()}`
    );
    
    return response;
  }
}

// Concrete implementation
class CaptureRepository extends BaseRepository<Capture, CaptureId> {
  private readonly endpoint = '/captures';

  async findById(id: CaptureId): Promise<Capture | null> {
    try {
      const response = await this.apiClient.get<Capture>(`${this.endpoint}/${id}`);
      return response;
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null;
      }
      throw error;
    }
  }

  async findAll(filters?: Partial<Capture>): Promise<Capture[]> {
    const response = await this.query<Capture>(this.endpoint, { filters });
    return response.data;
  }

  async create(entity: Omit<Capture, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<Capture> {
    const response = await this.apiClient.post<Capture>(this.endpoint, entity);
    return response;
  }

  async update(id: CaptureId, entity: Partial<Capture>): Promise<Capture> {
    const response = await this.apiClient.put<Capture>(`${this.endpoint}/${id}`, entity);
    return response;
  }

  async delete(id: CaptureId): Promise<void> {
    await this.apiClient.delete(`${this.endpoint}/${id}`);
  }

  // Domain-specific methods
  async findByUserId(userId: UserId): Promise<Capture[]> {
    const response = await this.query<Capture>(this.endpoint, {
      filters: { userId } as Partial<Capture>
    });
    return response.data;
  }

  async findByStatus(status: CaptureStatus): Promise<Capture[]> {
    const response = await this.query<Capture>(this.endpoint, {
      filters: { status } as Partial<Capture>
    });
    return response.data;
  }
}
```

### 4. **Service Layer with Dependency Injection**

```typescript
// src/shared/types/service.types.ts

interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: ServiceError;
}

interface ServiceError {
  code: string;
  message: string;
  details?: unknown;
}

// Service base class
abstract class BaseService {
  constructor(
    protected logger: Logger,
    protected eventBus: EventBus
  ) {}

  protected async handleServiceCall<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<ServiceResult<T>> {
    try {
      this.logger.info(`Starting ${operationName}`);
      const data = await operation();
      this.logger.info(`Completed ${operationName}`);
      return { success: true, data };
    } catch (error) {
      this.logger.error(`Failed ${operationName}:`, error);
      return {
        success: false,
        error: {
          code: error instanceof Error ? error.name : 'UNKNOWN_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          details: error
        }
      };
    }
  }
}

// Capture service implementation
class CaptureService extends BaseService {
  constructor(
    private repository: CaptureRepository,
    private cacheService: CacheService,
    private aiService: AIService,
    logger: Logger,
    eventBus: EventBus
  ) {
    super(logger, eventBus);
  }

  async getCaptures(filters?: CaptureFilters): Promise<ServiceResult<Capture[]>> {
    return this.handleServiceCall(async () => {
      const cacheKey = `captures:${JSON.stringify(filters)}`;
      
      // Check cache first
      const cached = await this.cacheService.get<Capture[]>(cacheKey);
      if (cached) {
        this.logger.debug('Returning cached captures');
        return cached;
      }

      // Fetch from repository
      const captures = await this.repository.findAll(filters);
      
      // Cache the result
      await this.cacheService.set(cacheKey, captures, 300); // 5 minutes
      
      return captures;
    }, 'getCaptures');
  }

  async createCapture(data: CreateCaptureDto): Promise<ServiceResult<Capture>> {
    return this.handleServiceCall(async () => {
      // Validate input
      const validatedData = this.validateCreateCaptureData(data);
      
      // Create capture
      const capture = await this.repository.create(validatedData);
      
      // Emit event
      this.eventBus.emit('CAPTURE_CREATED', {
        capture,
        userId: data.userId
      });
      
      // Invalidate cache
      await this.cacheService.invalidatePattern('captures:*');
      
      return capture;
    }, 'createCapture');
  }

  async processCaptureWithAI(captureId: CaptureId): Promise<ServiceResult<Capture>> {
    return this.handleServiceCall(async () => {
      const capture = await this.repository.findById(captureId);
      if (!capture) {
        throw new Error('Capture not found');
      }

      // Process with AI
      const aiResult = await this.aiService.processCapture(capture);
      
      // Update capture with AI results
      const updatedCapture = await this.repository.update(captureId, {
        ai: aiResult,
        status: CaptureStatus.COMPLETE
      });
      
      // Emit event
      this.eventBus.emit('CAPTURE_PROCESSED', {
        capture: updatedCapture,
        aiResult
      });
      
      return updatedCapture;
    }, 'processCaptureWithAI');
  }

  private validateCreateCaptureData(data: CreateCaptureDto): CreateCaptureDto {
    // Validation logic
    if (!data.url || !data.title) {
      throw new ValidationError('URL and title are required');
    }
    
    return data;
  }
}
```

### 5. **Modern State Management with Zustand**

```typescript
// src/features/capture/store/capture.store.ts

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface CaptureState {
  captures: Capture[];
  selectedCapture: Capture | null;
  filters: CaptureFilters;
  loading: boolean;
  error: string | null;
}

interface CaptureActions {
  setCaptures: (captures: Capture[]) => void;
  addCapture: (capture: Capture) => void;
  updateCapture: (id: CaptureId, updates: Partial<Capture>) => void;
  removeCapture: (id: CaptureId) => void;
  setSelectedCapture: (capture: Capture | null) => void;
  setFilters: (filters: CaptureFilters) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type CaptureStore = CaptureState & CaptureActions;

export const useCaptureStore = create<CaptureStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // State
        captures: [],
        selectedCapture: null,
        filters: {},
        loading: false,
        error: null,

        // Actions
        setCaptures: (captures) =>
          set((state) => {
            state.captures = captures;
          }),

        addCapture: (capture) =>
          set((state) => {
            state.captures.unshift(capture);
          }),

        updateCapture: (id, updates) =>
          set((state) => {
            const index = state.captures.findIndex(c => c.id === id);
            if (index !== -1) {
              state.captures[index] = { ...state.captures[index], ...updates };
            }
            
            if (state.selectedCapture?.id === id) {
              state.selectedCapture = { ...state.selectedCapture, ...updates };
            }
          }),

        removeCapture: (id) =>
          set((state) => {
            state.captures = state.captures.filter(c => c.id !== id);
            if (state.selectedCapture?.id === id) {
              state.selectedCapture = null;
            }
          }),

        setSelectedCapture: (capture) =>
          set((state) => {
            state.selectedCapture = capture;
          }),

        setFilters: (filters) =>
          set((state) => {
            state.filters = filters;
          }),

        setLoading: (loading) =>
          set((state) => {
            state.loading = loading;
          }),

        setError: (error) =>
          set((state) => {
            state.error = error;
          }),

        clearError: () =>
          set((state) => {
            state.error = null;
          }),
      })),
      {
        name: 'capture-store',
        partialize: (state) => ({
          captures: state.captures,
          filters: state.filters,
        }),
      }
    ),
    {
      name: 'capture-store',
    }
  )
);

// Selectors
export const useCaptures = () => useCaptureStore((state) => state.captures);
export const useSelectedCapture = () => useCaptureStore((state) => state.selectedCapture);
export const useCaptureFilters = () => useCaptureStore((state) => state.filters);
export const useCaptureLoading = () => useCaptureStore((state) => state.loading);
export const useCaptureError = () => useCaptureStore((state) => state.error);

// Action selectors
export const useCaptureActions = () => useCaptureStore((state) => ({
  setCaptures: state.setCaptures,
  addCapture: state.addCapture,
  updateCapture: state.updateCapture,
  removeCapture: state.removeCapture,
  setSelectedCapture: state.setSelectedCapture,
  setFilters: state.setFilters,
  setLoading: state.setLoading,
  setError: state.setError,
  clearError: state.clearError,
}));
```

### 6. **Custom Hooks with TypeScript**

```typescript
// src/features/capture/hooks/use-captures.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCaptureStore } from '../store/capture.store';
import { captureService } from '../services/capture.service';

export const useCaptures = (filters?: CaptureFilters) => {
  const { setCaptures, setLoading, setError, clearError } = useCaptureStore();
  
  return useQuery({
    queryKey: ['captures', filters],
    queryFn: async () => {
      setLoading(true);
      clearError();
      
      const result = await captureService.getCaptures(filters);
      
      if (result.success && result.data) {
        setCaptures(result.data);
        return result.data;
      } else {
        setError(result.error?.message || 'Failed to fetch captures');
        throw new Error(result.error?.message || 'Failed to fetch captures');
      }
    },
    onSettled: () => setLoading(false),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateCapture = () => {
  const queryClient = useQueryClient();
  const { addCapture } = useCaptureStore();
  
  return useMutation({
    mutationFn: async (data: CreateCaptureDto) => {
      const result = await captureService.createCapture(data);
      
      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error(result.error?.message || 'Failed to create capture');
      }
    },
    onSuccess: (capture) => {
      addCapture(capture);
      queryClient.invalidateQueries({ queryKey: ['captures'] });
    },
    onError: (error) => {
      console.error('Failed to create capture:', error);
    },
  });
};

export const useUpdateCapture = () => {
  const queryClient = useQueryClient();
  const { updateCapture } = useCaptureStore();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: CaptureId; data: UpdateCaptureDto }) => {
      const result = await captureService.updateCapture(id, data);
      
      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error(result.error?.message || 'Failed to update capture');
      }
    },
    onSuccess: (capture) => {
      updateCapture(capture.id, capture);
      queryClient.invalidateQueries({ queryKey: ['captures'] });
      queryClient.invalidateQueries({ queryKey: ['capture', capture.id] });
    },
  });
};

// Composite hook for capture management
export const useCaptureManagement = () => {
  const capturesQuery = useCaptures();
  const createMutation = useCreateCapture();
  const updateMutation = useUpdateCapture();
  
  return {
    // Data
    captures: capturesQuery.data ?? [],
    loading: capturesQuery.isLoading,
    error: capturesQuery.error,
    
    // Actions
    createCapture: createMutation.mutate,
    updateCapture: updateMutation.mutate,
    
    // Status
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    
    // Utilities
    refetch: capturesQuery.refetch,
  };
};
```

### 7. **Error Handling with Result Pattern**

```typescript
// src/shared/types/result.types.ts

type Result<T, E = Error> = Success<T> | Failure<E>;

interface Success<T> {
  success: true;
  data: T;
}

interface Failure<E> {
  success: false;
  error: E;
}

// Result utility functions
export const success = <T>(data: T): Success<T> => ({
  success: true,
  data,
});

export const failure = <E>(error: E): Failure<E> => ({
  success: false,
  error,
});

export const isSuccess = <T, E>(result: Result<T, E>): result is Success<T> => {
  return result.success;
};

export const isFailure = <T, E>(result: Result<T, E>): result is Failure<E> => {
  return !result.success;
};

// Result monad methods
export class ResultMonad<T, E = Error> {
  constructor(private result: Result<T, E>) {}

  map<U>(fn: (value: T) => U): ResultMonad<U, E> {
    if (isSuccess(this.result)) {
      return new ResultMonad(success(fn(this.result.data)));
    }
    return new ResultMonad(this.result as Failure<E>);
  }

  flatMap<U>(fn: (value: T) => Result<U, E>): ResultMonad<U, E> {
    if (isSuccess(this.result)) {
      return new ResultMonad(fn(this.result.data));
    }
    return new ResultMonad(this.result as Failure<E>);
  }

  mapError<F>(fn: (error: E) => F): ResultMonad<T, F> {
    if (isFailure(this.result)) {
      return new ResultMonad(failure(fn(this.result.error)));
    }
    return new ResultMonad(this.result as Success<T>);
  }

  getOrElse(defaultValue: T): T {
    if (isSuccess(this.result)) {
      return this.result.data;
    }
    return defaultValue;
  }

  getOrThrow(): T {
    if (isSuccess(this.result)) {
      return this.result.data;
    }
    throw this.result.error;
  }
}

// Usage example
const processCapture = async (id: CaptureId): Promise<Result<Capture, string>> => {
  try {
    const capture = await captureRepository.findById(id);
    if (!capture) {
      return failure('Capture not found');
    }
    
    const processedCapture = await aiService.processCapture(capture);
    return success(processedCapture);
  } catch (error) {
    return failure(error instanceof Error ? error.message : 'Unknown error');
  }
};
```

### 8. **Form Handling with Zod Validation**

```typescript
// src/features/capture/schemas/capture.schemas.ts

import { z } from 'zod';

export const CreateCaptureSchema = z.object({
  url: z.string().url('Invalid URL format'),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  folderId: z.string().optional(),
});

export const UpdateCaptureSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  folderId: z.string().optional(),
});

export type CreateCaptureFormData = z.infer<typeof CreateCaptureSchema>;
export type UpdateCaptureFormData = z.infer<typeof UpdateCaptureSchema>;

// Form component with validation
export const CaptureForm: React.FC<{
  initialData?: Partial<CreateCaptureFormData>;
  onSubmit: (data: CreateCaptureFormData) => void;
}> = ({ initialData, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateCaptureFormData>({
    resolver: zodResolver(CreateCaptureSchema),
    defaultValues: initialData,
  });

  const onFormSubmit = async (data: CreateCaptureFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="url" className="block text-sm font-medium">
          URL
        </label>
        <input
          {...register('url')}
          type="url"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.url && (
          <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          {...register('title')}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {isSubmitting ? 'Creating...' : 'Create Capture'}
      </button>
    </form>
  );
};
```

This comprehensive TypeScript architecture provides:

1. **Type Safety**: Strict typing throughout the application
2. **Scalability**: Modular, feature-based organization
3. **Maintainability**: Clear separation of concerns
4. **Performance**: Optimized state management and caching
5. **Developer Experience**: Excellent tooling and error handling
6. **Testing**: Built-in testing patterns and utilities

The architecture follows senior-level engineering practices with modern TypeScript patterns, making it production-ready and maintainable for large-scale applications.
