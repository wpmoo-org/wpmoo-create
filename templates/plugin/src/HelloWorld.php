<?php

namespace {{NAMESPACE}}\Src;

class HelloWorld {
    public function greet(string $name): string {
        return "Hello, {$name} from {{PROJECT_NAME}}!";
    }
}
