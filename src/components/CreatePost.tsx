"use client"

import { useUser } from "@clerk/nextjs"
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "./ui/button";
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import { createPost } from "@/actions/post.action";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "./ui/toast";
import ImageUpload from "./ImageUpload";


const CreatePost = () => {
  const {user} = useUser();
  const { toast } = useToast();
  const [content,setContent] = useState('');
  const [imageUrl,setImageUrl] = useState('');
  const [isPosting,setIsPostring] = useState(false);
  const [showImageUpload,setShowImageUpload] = useState(false);
  
  const handleSubmit = async () => {
    if(!content.trim() && !imageUrl) return;
    setIsPostring(true)
    try {
      const responce = await createPost(content,imageUrl);
      if(responce.success){
        setContent('');
        setImageUrl('');
        setShowImageUpload(false);
        toast({
          description: "Post created successfully.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem on server.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }finally{
      setIsPostring(false)
    }
  }
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-6">
        <div className="flex space-x-4">
          <Avatar className="w-10 h-10 ">
            <AvatarImage src={user?.imageUrl || '/avatar.png'}/>
          </Avatar>
          <Textarea
          placeholder="What's on your mind?"
          className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-base"
          value={content}
          onChange={(e) => {setContent(e.target.value)}}
          disabled={isPosting}
          />
        </div>
        {(showImageUpload || imageUrl) &&
        (<div className="border rounded-lg p-4">
          <ImageUpload endpoint="postImage" value={imageUrl} onChange={(url) => {
            setImageUrl(url);
            if(!url)setShowImageUpload(false)
          }}/>
        </div>)
        }
        <div className="flex items-center justify-between border-t pt-4">
    <div className="flex space-x-2">
        <Button 
        type="button"
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-primary"
        onClick={() => {setShowImageUpload(!showImageUpload)}}
        disabled={isPosting}
        >
          <ImageIcon className="size-4 mr-2"/>
          Photo
        </Button>
    </div>
    <Button
    className="flex items-center"
    onClick={handleSubmit}
    disabled={(!content.trim() && !imageUrl || isPosting)}
    >
      {
        isPosting ? (
          <>
            <Loader2Icon className="size-4 mr-1 animate-spin"/>
            Posting...
          </>
        ):(
          <>
            <SendIcon className="size-4 mr-1"/>
            Post
          </>
        )
      }
    </Button>
        </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CreatePost