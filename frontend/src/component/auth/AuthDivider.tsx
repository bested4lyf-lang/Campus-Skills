interface AuthDividerProps {
text?: string;
}

export default function AuthDivider({
text = "Or continue with",
}: AuthDividerProps) {
return ( <div className="my-6 flex items-center gap-4"> <div className="h-px flex-1 bg-line" />

```
  <span className="shrink-0 text-xs font-medium text-ink-400">
    {text}
  </span>

  <div className="h-px flex-1 bg-line" />
</div>


);
}
