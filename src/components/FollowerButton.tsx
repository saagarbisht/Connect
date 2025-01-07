'use client'

import { useState } from "react"
import { Button } from "./ui/button"
import { Loader2Icon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "./ui/toast"
import { toggleFollow } from "@/actions/user.action"

const FollowerButton = ({userId,userName}:{userId:string,userName:string}) => {
  const { toast } = useToast();
  const [isLoading,setIsLoading] = useState(false)
  const handleFollow = async () => {
    setIsLoading(true);
    try {
      const responce = await toggleFollow(userId)
      if(responce?.success){
        toast({
          description: `You are now following @${userName}`,
        })
      }else{
        throw new Error('toggle follow fail');
      }

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem on server.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }finally{
      setIsLoading(false);
    }
  }
  return (
    <Button
    size='sm'
    variant='secondary'
    onClick={handleFollow}
    className="w-20"
    >
      {isLoading ? <Loader2Icon className="w-4 h-4 animate-spin"/> : "Follow"}
    </Button>
  )
}

export default FollowerButton