const categoryImages = {
  'Pain Relief': [
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1626716493137-b67fe9501e76?w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=900&auto=format&fit=crop',
  ],
  Antibiotics: [
    'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=900&auto=format&fit=crop',
  ],
  'Cold & Flu': [
    'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1578496781985-452d4a934d50?w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=900&auto=format&fit=crop',
  ],
  'Vitamins & Supplements': [
    'https://images.unsplash.com/photo-1611242320536-f12d3541249b?w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=900&auto=format&fit=crop',
  ],
  'Digestive Health': [
    'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=900&auto=format&fit=crop',
  ],
};

const fallbackImages = [
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=900&auto=format&fit=crop',
];

export const formatInr = (amount) => {
  const value = Number(amount ?? 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
};

export const getMedicineImage = (medicine) => {
  if (medicine?.imageUrl) return medicine.imageUrl;

  const category = medicine?.categoryName || medicine?.category || '';
  const pool = categoryImages[category] || fallbackImages;
  const seed = Number(medicine?.id) || String(medicine?.name || '').length || 1;
  return pool[seed % pool.length];
};
