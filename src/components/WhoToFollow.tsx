import { getRandomUser } from "@/actions/user.action"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { Avatar } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import FollowerButton from "./FollowerButton";

const WhoToFollow = async () => {
  const users = await getRandomUser();
  // if(users.length === 0)return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Who to Follow
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex gap-2 items-center justify-between">
              <div className="flex items-center gap-1">
                <Link href={`/profile/${user.username}`}>
                <Avatar className="w-11 h-11 mr-0.5">
                  <AvatarImage src={user.image ?? "/avatar.png"}/>
                </Avatar>
                </Link>
                <div className="text-xs flex flex-col gap-0.5 items-start">
                  <Link href={`/profile/${user.username}`} className="font-medium cursor-pointer">
                  {user.name}
                  </Link>
                  <p className="text-muted-foreground">@{user.username}</p>
                  <p className="text-muted-foreground">{user._count.followers} followers</p>
                </div>
              </div>
              <FollowerButton userId={user.id} userName={user.username}/>
            </div>
          ))}

        </div>
      </CardContent>
    </Card>
  )
}

export default WhoToFollow