export default function AvatarWrapper ({ children }) {
  return (
    <div className='bg-primary/10 w-16 h-16 rounded-full border-2 border-white box-content overflow-hidden'>
      {children}
    </div>
  )
}