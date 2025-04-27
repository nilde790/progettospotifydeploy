import { plainToInstance } from "class-transformer";
import { IsEnum, IsNumber, IsString, validateSync } from "class-validator";



enum Enviroment {
    Development = 'development',
    Production = 'production',
}

class EnviromentVariables{
    @IsEnum(Enviroment)
    NODE_ENV: Enviroment;

    @IsNumber()
    PORT: number;

    @IsString()
    SECRET: string;

    @IsString()
    DATABASE_URL: string;

    @IsString()
    DB_HOST: string;

    @IsString()
    USERNAME: string;

    
    PASSWORD: string;

    @IsString()
    DB_NAME: string;
}

export function validate(config: Record<string, unknown>) {
    
    const validatedConfig = plainToInstance(EnviromentVariables, config, { enableImplicitConversion: true,});

    const errors = validateSync(validatedConfig,{skipMissingProperties: false});

    if(errors.length > 0){
        throw new Error(errors.toString());
    }

    return validatedConfig;
}