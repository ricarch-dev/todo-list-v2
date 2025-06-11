"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        supabase.auth.signInWithPassword({
            email,
            password,
        }).then(({ data, error }) => {
            if (error) {
                toast.error(error.message || "Error logging in")
            } else {
                toast.success("Login successful", {
                    description: `Welcome ${data.user?.email}`
                })
                router.push("/dashboard")
            }
        }).catch((error) => {
            toast.error("Unexpected error", {
                description: error instanceof Error ? error.message : "Unknown error"
            })
        }).finally(() => {
            setIsLoading(false)
        })
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Login</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="user@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <div className="flex items-center gap-2">
                                    <Button variant="link" size="sm" className="px-0 font-normal" asChild>
                                        <Link href="/forgot-password">Forgot your password?</Link>
                                    </Button>
                                </div>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                        <p className="mt-4 text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Button variant="link" className="p-0 font-normal" asChild>
                                <Link href="/register">Register</Link>
                            </Button>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
