export const AVATAR_COLORS = [
  '#e57373', '#f06292', '#ba68c8',
  '#9575cd', '#7986cb', '#4fc3f7',
  '#4dd0e1', '#4db6ac', '#81c784',
  '#aed581', '#ffb74d', '#ff8a65'
];


export function getAvatarColor(name: string): string {
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}
