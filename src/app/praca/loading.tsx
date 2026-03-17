import SkeletonPost from './components/SkeletonPost'

export default function Loading() {
  return (
    <div className="max-w-xl mx-auto">
      <SkeletonPost />
      <SkeletonPost />
      <SkeletonPost />
    </div>
  )
}
