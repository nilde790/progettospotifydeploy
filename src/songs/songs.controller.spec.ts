import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

describe('SongsController', () => {
  let controller: SongsController;
  let service: SongsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers:[
        {
          provide: SongsService,
          useValue:{
            getSongs: jest.fn().mockResolvedValue([{ id: "123131", title: "Dancing" }]),
            getSong: jest.fn().mockImplementation((id: number) => {
              return Promise.resolve({ id, title: "Dancing" });
            }),
            create: jest.fn().mockImplementation((dto: CreateSongDto) => {
              return Promise.resolve({ id: "a uuid", ...dto });
            }),
            update: jest.fn().mockImplementation((id: number, dto: UpdateSongDto) => {
              return Promise.resolve({ id, ...dto });
            }),
            remove: jest.fn().mockResolvedValue({id: 1}),
            getWithPagine: jest.fn().mockResolvedValue({
              song: [{ id: 1, title: 'Paginated song' }],
              total: 1,
              page: 1,
              limit: 10,
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<SongsController>(SongsController);
    service = module.get<SongsService>(SongsService);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });
  
  describe("findAll", () => {
    it("should give me the array of songs", async () => {
      const songs = await controller.findAll();
      expect(songs).toEqual([{ id: "123131", title: "Dancing" }]);
    });
  });
  
  describe("findOne by id", () => {
    it("should give me the song by id", async () => {
      const song = await controller.findOne("123131" as any); // usa "as any" se ti dà errore di tipo
      expect(song.id).toBe("123131");
    });
  });
  
  describe("createSong", () => {
    it("should create a new song", async () => {
      const newSongDTO: CreateSongDto = {
        title: "Runaway",
        releasedDate: new Date().toISOString(),
        duration: "180",
        lyrics: "Some lyrics",
        artistId: [1],
      };
  
      const song = await controller.create(newSongDTO, { user: {} });
      expect(song.title).toBe("Runaway");
    });
  });
  
  describe("updateSong", () => {
    it("should update the song DTO", async () => {
      const updateSongDTO: UpdateSongDto = {
        title: "Animals",
        releasedDate: new Date().toISOString(),
        duration: "200",
        lyrics: "Updated lyrics",
        artistId: [1],
      };
  
      const updateResults = await controller.update("a uuid" as any, updateSongDTO);
      expect(updateResults).toBeDefined();
      expect(updateResults).toHaveProperty('title', 'Animals');
    });
  });
  
  describe("deleteSong", () => {
    it("should delete the song", async () => {
      const deleteResult = await controller.remove("a uuid" as any);
      expect(deleteResult).toEqual({ id: 1 });
    });
  });
});

