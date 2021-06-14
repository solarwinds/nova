import { TestBed } from '@angular/core/testing';

import { ToolbarNavigationService } from './toolbar-navigation.service';

describe('ToolbarNavigationService', () => {
  let service: ToolbarNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToolbarNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
