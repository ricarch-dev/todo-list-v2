import { Skeleton } from "./ui/skeleton"

export default function TodoSkeleton() {
    return (
        <>
            {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-md border p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                            <Skeleton className="h-5 w-5 mt-1" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-5 w-40" />
                                <Skeleton className="h-4 w-full max-w-[250px]" />
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-6 w-24" />
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}