export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

// Helper function to normalize priority values from the database
export const normalizePriority = (priority: string): TaskPriority => {
  const lowerPriority = priority.toLowerCase();
  switch (lowerPriority) {
    case 'low':
      return TaskPriority.LOW;
    case 'medium':
      return TaskPriority.MEDIUM;
    case 'high':
      return TaskPriority.HIGH;
    default:
      return TaskPriority.MEDIUM; // Default to medium if unknown
  }
};
