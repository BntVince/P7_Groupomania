import tortue from '../assets/tortue.png'

const posts = [
   {
      description:
         '1er post test depuis datas du front + balbab lblablablabblalbabl ablblalbblablablablablb alblablablblblablablablblablablablbla',
      imageUrl: '',
      userId: '2',
      likes: 2,
      _id: '1',
   },
   {
      description: 'Rien à dire',
      imageUrl: '',
      userId: '2',
      likes: 0,
      _id: '2',
   },
   {
      description: 'Elle est pas belle ma tortue ????',
      imageUrl: { tortue },
      userId: '3',
      likes: 0,
      _id: '3',
   },
]

export default posts
